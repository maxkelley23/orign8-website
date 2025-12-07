---
name: gemini-voice
description: Gemini AI voice transcription integration for orign8-website. Use when working with voice input, speech-to-text, audio recording, microphone access, or AI-powered transcription. Covers Web Audio API, MediaRecorder, and Gemini API integration.
---

# Gemini Voice Transcription Guide

## Purpose

Guide for implementing voice input and AI-powered transcription using Google's Gemini API in the orign8-website contact form.

## When to Use This Skill

- Implementing voice input features
- Recording audio from microphone
- Transcribing speech to text
- Integrating Gemini AI API
- Handling audio permissions
- Processing audio data

---

## Quick Reference

### Dependencies

```json
{
    "@google/genai": "^1.30.0"
}
```

### Environment Variables

```bash
# .env.local
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## Gemini Client Setup

```typescript
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

// Get the Gemini model for audio transcription
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
```

---

## Voice Recording Implementation

### Recording Hook

```typescript
import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecordingReturn {
    isRecording: boolean;
    audioBlob: Blob | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    error: string | null;
}

export const useVoiceRecording = (): UseVoiceRecordingReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start(100); // Collect data every 100ms
            setIsRecording(true);
        } catch (err) {
            setError('Microphone access denied. Please allow microphone access.');
            console.error('Recording error:', err);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    return {
        isRecording,
        audioBlob,
        startRecording,
        stopRecording,
        error
    };
};
```

---

## Transcription Service

### Basic Transcription

```typescript
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
        // Convert blob to base64
        const base64Audio = await blobToBase64(audioBlob);

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: audioBlob.type,
                    data: base64Audio
                }
            },
            {
                text: 'Please transcribe this audio accurately. If the audio contains mortgage or real estate terminology, ensure those terms are transcribed correctly. Return only the transcription, no additional commentary.'
            }
        ]);

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Transcription error:', error);
        throw new Error('Failed to transcribe audio');
    }
};

// Helper function to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            // Remove the data URL prefix
            resolve(base64.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
```

### Mortgage-Specific Transcription

```typescript
export const transcribeMortgageAudio = async (audioBlob: Blob): Promise<{
    transcription: string;
    extractedData: MortgageData;
}> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const base64Audio = await blobToBase64(audioBlob);

    const result = await model.generateContent([
        {
            inlineData: {
                mimeType: audioBlob.type,
                data: base64Audio
            }
        },
        {
            text: `Transcribe this audio and extract any mortgage-related information.
            Return a JSON object with:
            {
                "transcription": "full transcription text",
                "extractedData": {
                    "name": "extracted name or null",
                    "phone": "extracted phone or null",
                    "email": "extracted email or null",
                    "loanType": "mentioned loan type or null",
                    "propertyType": "mentioned property type or null",
                    "intent": "buy/refinance/other or null"
                }
            }`
        }
    ]);

    const response = await result.response;
    return JSON.parse(response.text());
};
```

---

## Voice Input Component

```typescript
import React, { useState, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { transcribeAudio } from '../services/geminiService';

interface VoiceInputProps {
    onTranscription: (text: string) => void;
    className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
    onTranscription,
    className = ''
}) => {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const {
        isRecording,
        audioBlob,
        startRecording,
        stopRecording,
        error
    } = useVoiceRecording();

    const handleToggleRecording = useCallback(async () => {
        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    // Process audio when recording stops
    React.useEffect(() => {
        if (audioBlob && !isRecording) {
            const processAudio = async () => {
                setIsTranscribing(true);
                try {
                    const transcription = await transcribeAudio(audioBlob);
                    onTranscription(transcription);
                } catch (err) {
                    console.error('Transcription failed:', err);
                } finally {
                    setIsTranscribing(false);
                }
            };
            processAudio();
        }
    }, [audioBlob, isRecording, onTranscription]);

    return (
        <div className={className}>
            <button
                type="button"
                onClick={handleToggleRecording}
                disabled={isTranscribing}
                className={`
                    p-3 rounded-full transition-all duration-200
                    ${isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }
                    hover:scale-105 disabled:opacity-50
                `}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                {isTranscribing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : isRecording ? (
                    <MicOff className="w-6 h-6" />
                ) : (
                    <Mic className="w-6 h-6" />
                )}
            </button>

            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}

            {isRecording && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Recording... Click to stop
                </p>
            )}

            {isTranscribing && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Transcribing...
                </p>
            )}
        </div>
    );
};
```

---

## Integration with Contact Form

```typescript
import React, { useState } from 'react';
import { VoiceInput } from '../components/VoiceInput';
import { submitLead } from '../services/supabaseClient';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        transcription: ''
    });

    const handleTranscription = (text: string) => {
        setFormData(prev => ({
            ...prev,
            message: prev.message + ' ' + text,
            transcription: text
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitLead(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Other form fields */}

            <div className="flex items-center gap-4">
                <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        message: e.target.value
                    }))}
                    placeholder="Your message..."
                    className="flex-1 p-3 border rounded-lg dark:bg-slate-800"
                />
                <VoiceInput onTranscription={handleTranscription} />
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};
```

---

## Permissions Handling

```typescript
export const checkMicrophonePermission = async (): Promise<PermissionState> => {
    try {
        const result = await navigator.permissions.query({
            name: 'microphone' as PermissionName
        });
        return result.state;
    } catch {
        // Fallback for browsers that don't support permissions API
        return 'prompt';
    }
};

export const requestMicrophoneAccess = async (): Promise<boolean> => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch {
        return false;
    }
};
```

---

## Error Handling

```typescript
export enum TranscriptionError {
    MICROPHONE_DENIED = 'MICROPHONE_DENIED',
    API_ERROR = 'API_ERROR',
    INVALID_AUDIO = 'INVALID_AUDIO',
    NETWORK_ERROR = 'NETWORK_ERROR'
}

export const getErrorMessage = (error: TranscriptionError): string => {
    const messages: Record<TranscriptionError, string> = {
        [TranscriptionError.MICROPHONE_DENIED]:
            'Please allow microphone access to use voice input.',
        [TranscriptionError.API_ERROR]:
            'Transcription service temporarily unavailable.',
        [TranscriptionError.INVALID_AUDIO]:
            'Could not process audio. Please try recording again.',
        [TranscriptionError.NETWORK_ERROR]:
            'Network error. Please check your connection.'
    };
    return messages[error];
};
```

---

## Anti-Patterns to Avoid

❌ Not releasing microphone tracks after recording
❌ Exposing API key in client-side code without protection
❌ Not handling permission denials gracefully
❌ Large audio files without compression
❌ Not providing visual feedback during recording/transcription

---

**Skill Status**: COMPLETE ✅
