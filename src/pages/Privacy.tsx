import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';

export const Privacy: React.FC = () => {
  const lastUpdated = 'December 2024';

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Shield size={24} />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-display tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand-600 dark:prose-a:text-brand-400">

          <p className="lead text-lg text-slate-600 dark:text-slate-400">
            Orign8 Technologies Inc. ("Orign8," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2>Information We Collect</h2>

          <h3>Information You Provide</h3>
          <p>We collect information you voluntarily provide when you:</p>
          <ul>
            <li><strong>Contact Form Submissions:</strong> Name, email address, company name, NMLS ID (optional), and message content</li>
            <li><strong>Voice Recordings:</strong> When you use our voice-to-text feature, audio is temporarily processed for transcription purposes only</li>
            <li><strong>Communications:</strong> When you email us or communicate with our team</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>IP address and general location data</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent</li>
            <li>Referring website addresses</li>
            <li>Device information</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Process and follow up on lead submissions</li>
            <li>Improve our website and services</li>
            <li>Send relevant communications about our products (with your consent)</li>
            <li>Comply with legal obligations</li>
            <li>Protect against fraudulent or unauthorized activity</li>
          </ul>

          <h2>Voice Data Processing</h2>
          <p>
            When you use our voice transcription feature:
          </p>
          <ul>
            <li>Audio is processed in real-time using Google's Gemini AI service</li>
            <li>We do not store audio recordings after transcription is complete</li>
            <li>Transcribed text may be included in your form submission</li>
            <li>Voice data is transmitted securely using encryption</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>We use trusted third-party services to operate our platform:</p>
          <ul>
            <li><strong>Supabase:</strong> Database hosting and data storage</li>
            <li><strong>Google Gemini:</strong> Voice transcription processing</li>
            <li><strong>Resend:</strong> Transactional email delivery</li>
            <li><strong>Vercel:</strong> Website hosting</li>
            <li><strong>Sentry:</strong> Error monitoring and performance tracking</li>
            <li><strong>Google Analytics:</strong> Website analytics (if enabled)</li>
          </ul>
          <p>
            These services have their own privacy policies and may collect information as specified in their respective policies.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information, including:
          </p>
          <ul>
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Secure database access controls</li>
            <li>Regular security assessments</li>
            <li>Limited employee access to personal data</li>
          </ul>
          <p>
            However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Lead submission data is typically retained for the duration of our business relationship plus any legally required period.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of your data in a portable format</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information below.
          </p>

          <h2>TCPA Compliance</h2>
          <p>
            Orign8's Voice AI platform is designed with TCPA (Telephone Consumer Protection Act) compliance as a core feature. Our systems include:
          </p>
          <ul>
            <li>Automated calling time restrictions based on recipient timezone</li>
            <li>Do-Not-Call registry integration</li>
            <li>State-specific compliance rules</li>
            <li>Consent management and verification</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We use essential cookies to ensure our website functions properly. We may also use analytics cookies to understand how visitors interact with our site. You can control cookie preferences through your browser settings.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="not-prose bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="font-semibold text-slate-900 dark:text-white mb-2">Orign8 Technologies Inc.</p>
            <a href="mailto:privacy@orign8.ai" className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline">
              <Mail size={16} />
              privacy@orign8.ai
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link to="/" className="text-brand-600 dark:text-brand-400 hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
