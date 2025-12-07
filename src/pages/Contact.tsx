import React, { useState, useRef } from 'react';
import { submitLead } from '../services/supabaseClient';
import { startTransaction, captureError } from '../services/monitoring';
import { trackLeadSubmitted, trackVoiceTranscriptionStarted, trackVoiceTranscriptionCompleted } from '../services/analytics';
import { Button } from '../components/Button';
import { ButtonVariant, ContactFormData } from '../types';
import { CheckCircle, AlertCircle, Loader2, ArrowRight, Mic, Square, Wand2 } from 'lucide-react';

// API base URL - use environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    nmlsId: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startRecording = async () => {
    try {
      setErrorMessage(''); // Clear any previous errors
      trackVoiceTranscriptionStarted();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMessage("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    // Start performance tracking for AI transcription
    const transaction = startTransaction('ai.transcription', 'ai.call');

    try {
      // Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];

        try {
          // Use the secure backend proxy instead of client-side API calls
          const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audio: {
                mimeType: 'audio/webm',
                data: base64Data,
              },
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.error || `Transcription failed: ${response.status}`);
            captureError(error, {
              tags: { operation: 'voice-transcription' },
              extra: { status: response.status },
            });
            throw error;
          }

          const data = await response.json();
          const transcription = data.transcription;

          transaction.finish();
          trackVoiceTranscriptionCompleted({ success: true });

          if (transcription) {
            setFormData(prev => ({
              ...prev,
              message: prev.message + (prev.message ? ' ' : '') + transcription.trim()
            }));
          }
        } catch (apiError) {
          transaction.finish();
          trackVoiceTranscriptionCompleted({ success: false });
          console.error("Transcription error:", apiError);
          captureError(apiError instanceof Error ? apiError : new Error('Transcription failed'), {
            tags: { operation: 'voice-transcription' },
          });
          setErrorMessage("Failed to transcribe audio. Please try typing instead.");
        } finally {
          setIsTranscribing(false);
        }
      };

      reader.onerror = () => {
        transaction.finish();
        console.error("Error reading audio file");
        captureError(new Error('Failed to read audio file'), {
          tags: { operation: 'voice-transcription', stage: 'file-read' },
        });
        setErrorMessage("Failed to process audio. Please try again.");
        setIsTranscribing(false);
      };
    } catch (err) {
      transaction.finish();
      console.error("Error processing audio:", err);
      captureError(err instanceof Error ? err : new Error('Audio processing failed'), {
        tags: { operation: 'voice-transcription' },
      });
      setErrorMessage("Failed to process audio. Please try again.");
      setIsTranscribing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const result = await submitLead(formData);
      if (result.success) {
        setStatus('success');
        trackLeadSubmitted({
          company: formData.company,
          hasNmls: !!formData.nmlsId,
          source: 'contact-form',
        });
        setFormData({ firstName: '', lastName: '', email: '', company: '', nmlsId: '', message: '' });
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

        {/* Left Side: Copy */}
        <div className="py-8">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">Let's Talk Growth</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed">
            Ready to see how Orign8 can transform your loan origination process? Fill out the intake form to schedule a personalized demo.
          </p>

          <div className="space-y-10">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold shadow-sm shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:border-brand-200 dark:group-hover:border-brand-800 transition-colors">
                1
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Discovery Call</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">We analyze your current lead flow and database size to recommend the right AI agents.</p>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold shadow-sm shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:border-brand-200 dark:group-hover:border-brand-800 transition-colors">
                2
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Integration Setup</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">We connect with your existing CRM via secure API to sync leads automatically.</p>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold shadow-sm shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:border-brand-200 dark:group-hover:border-brand-800 transition-colors">
                3
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Launch & Monitor</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Go live. Watch the appointments populate on your calendar automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/30 relative transition-colors">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Received</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Thanks for your interest in Orign8. Our onboarding team will reach out to you shortly.</p>
              <Button
                variant={ButtonVariant.OUTLINE}
                onClick={() => setStatus('idle')}
              >
                Book another demo
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-slate-400 focus:ring-0 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-slate-400 focus:ring-0 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-slate-400 focus:ring-0 outline-none transition-all placeholder:text-slate-400"
                  placeholder="jane@lender.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-slate-400 focus:ring-0 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Acme Mortgage"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="nmlsId" className="text-sm font-semibold text-slate-700 dark:text-slate-300">NMLS # <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    id="nmlsId"
                    name="nmlsId"
                    value={formData.nmlsId}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-slate-400 focus:ring-0 outline-none transition-all placeholder:text-slate-400"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-slate-300">How can we help?</label>
                  {isTranscribing ? (
                    <span className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1.5 animate-pulse">
                      <Wand2 size={12} /> Transcribing audio...
                    </span>
                  ) : isRecording ? (
                    <span className="text-xs text-red-500 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Recording...
                    </span>
                  ) : null}
                </div>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 pr-12 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-slate-400 focus:ring-0 outline-none transition-all resize-none placeholder:text-slate-400"
                    placeholder="Tell us about your current lead volume..."
                  />
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isTranscribing}
                    className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
                      isRecording
                        ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                        : isTranscribing
                          ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 cursor-wait'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                    }`}
                    title="Voice Input"
                  >
                    {isTranscribing ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : isRecording ? (
                      <Square size={18} className="fill-current" />
                    ) : (
                      <Mic size={18} />
                    )}
                  </button>
                </div>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle size={16} />
                  {errorMessage}
                </div>
              )}

              {/* Audio error message specifically */}
              {errorMessage && errorMessage.includes('microphone') && status !== 'error' && (
                 <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle size={16} />
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={status === 'submitting'}
                className="h-12 text-base shadow-lg group"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} /> Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Application <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
