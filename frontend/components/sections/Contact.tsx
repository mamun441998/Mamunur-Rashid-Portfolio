'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Globe, Send, Check, Copy, Terminal, ExternalLink, Sparkles, CalendarClock } from 'lucide-react';
import { api } from '@/lib/api';
import { useSettings } from '@/hooks/useSettings';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { data: settings } = useSettings();
  // Google Calendar appointment link (auto-adds a Google Meet per booking).
  // Editable from admin → Portfolio CMS "Meeting / Booking URL"; falls back to
  // this default so the button always works even before the CMS value is set.
  const DEFAULT_MEETING_URL =
    'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1BoiiiiIA5Oo22YNFCmFPMHCes4DDo3IATKgLs43xvKX72cWk1MJkpA0Sj-dDwYpJckYI70L-q';
  const meetingUrl = settings?.calendly_url?.trim() || DEFAULT_MEETING_URL;

  // Contact details are admin-controlled (Portfolio CMS / Settings), with fallbacks.
  const contactEmail = settings?.email?.trim() || 'mamun441998@gmail.com';
  const contactPhone = settings?.phone?.trim() || '+880 1978529953';
  const whatsappNumber = contactPhone.replace(/[^0-9]/g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await api.contact.send({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Portfolio Contact Inquiry',
        message: formData.message,
      });

      setStatus({
        type: 'success',
        message: 'Message dispatched successfully! I will respond within 24 hours.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error("Contact Form Error:", err);
      setStatus({
        type: 'error',
        message: 'Failed to deliver message. Please reach out directly via Email or WhatsApp.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact" data-theme="dark"
      className="min-h-screen w-full py-24 px-6 sm:px-10 lg:px-16 flex flex-col justify-center items-center bg-[var(--sec-bg)] text-[var(--txt)] snap-start relative overflow-hidden select-none"
    >
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-[var(--color-accent)]/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Tech Contact HUD */}
        <div className="lg:col-span-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex w-fit mx-auto lg:mx-0 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-mono"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>INITIATE_COMMUNICATION.LOG</span>
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse ml-1" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-space-grotesk leading-[1.15]">
              Let&apos;s Build <br />
              <span className="text-[var(--color-accent)] text-glow">Scalable Systems</span> Together.
            </h2>
            <p className="text-[var(--txt-2)] mt-4 text-sm sm:text-base font-inter leading-relaxed max-w-lg mx-auto lg:mx-0">
              Have an enterprise architecture challenge, SaaS project in mind, or looking to hire a dedicated full-stack tech lead? Send a message or query directly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs font-mono text-[var(--txt-2)] w-fit"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-accent)]"></span>
            </span>
            <span>Available for Worldwide Remote Projects & Contracts</span>
          </motion.div>

          {/* Schedule a Meeting — opens the Google booking page (Google Meet) in a new tab */}
          <motion.a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-[var(--color-accent)]/40 bg-transparent overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(0,255,194,0.3)] w-fit cursor-pointer"
          >
            {/* Water Fill Effect from Bottom */}
            <span className="absolute inset-0 w-full h-full bg-[var(--color-accent)] pointer-events-none transition-transform duration-500 ease-out translate-y-[102%] group-hover:translate-y-0" />

            <CalendarClock className="relative z-10 w-4 h-4 text-[var(--color-accent)] group-hover:text-black transition-colors duration-300" />
            <span className="relative z-10 text-sm font-semibold font-space-grotesk text-[var(--color-accent)] group-hover:text-black transition-colors duration-300">
              Schedule a Meeting
            </span>
            <ExternalLink className="relative z-10 w-3.5 h-3.5 text-[var(--color-accent)] opacity-70 group-hover:opacity-100 group-hover:text-black transition-all duration-300" />
          </motion.a>
          <p className="text-[11px] font-mono text-[var(--txt-2)] -mt-2">
            Book a 30-min call · Google Meet link added automatically
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4 font-inter"
          >
            <div className="group relative p-4 rounded-2xl bg-[var(--panel)] border border-[var(--bd)] hover:border-[var(--color-accent)]/40 transition-all duration-300 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] group-hover:scale-105 transition-transform duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-[var(--txt-2)]">DIRECT EMAIL</p>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-sm font-semibold text-[var(--txt)] hover:text-[var(--color-accent)] transition-colors cursor-pointer break-all"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                type="button"
                className="p-2.5 rounded-xl bg-white/5 border border-[var(--bd)] hover:border-[var(--color-accent)]/50 text-[var(--txt-2)] hover:text-[var(--color-accent)] transition-all cursor-pointer"
                title="Copy Email"
              >
                {copied ? <Check className="w-4 h-4 text-[var(--color-accent)]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-[var(--panel)] border border-[var(--bd)] hover:border-[var(--color-accent)]/40 transition-all duration-300 flex items-center justify-between cursor-pointer block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] group-hover:scale-105 transition-transform duration-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-[var(--txt-2)]">INSTANT MESSAGING</p>
                  <p className="text-sm font-semibold text-[var(--txt)] group-hover:text-[var(--color-accent)] transition-colors">
                    {contactPhone}
                  </p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-[var(--bd)] group-hover:border-[var(--color-accent)]/50 text-[var(--txt-2)] group-hover:text-[var(--color-accent)] transition-all">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>

            <div className="p-4 rounded-2xl bg-[var(--panel)] border border-[var(--bd)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-[var(--bd)] flex items-center justify-center text-[var(--color-accent)]">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--txt-2)]">AVAILABILITY & LOCATION</p>
                <p className="text-sm font-semibold text-[var(--txt)]">
                  Worldwide Remote <span className="text-[var(--txt-2)] font-normal">• Multi-Timezone Flexible</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 bg-[var(--panel-4)] border border-[var(--bd)] rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent" />

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--txt-2)]">
              <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
              <span>SEND_DIRECT_DISPATCH</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--txt-2)] uppercase">Global Endpoint</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[var(--txt-2)] mb-1.5">YOUR NAME</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-[var(--input)] border border-[var(--bd)] focus:border-[var(--color-accent)] focus:bg-[var(--input-focus)] rounded-xl px-4 py-3 text-sm text-[var(--txt)] focus:outline-none transition-all placeholder:text-[var(--txt-2)] font-inter"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--txt-2)] mb-1.5">YOUR EMAIL</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-[var(--input)] border border-[var(--bd)] focus:border-[var(--color-accent)] focus:bg-[var(--input-focus)] rounded-xl px-4 py-3 text-sm text-[var(--txt)] focus:outline-none transition-all placeholder:text-[var(--txt-2)] font-inter"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--txt-2)] mb-1.5">SUBJECT</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="SaaS Platform Architecture / Work Inquiry"
                className="w-full bg-[var(--input)] border border-[var(--bd)] focus:border-[var(--color-accent)] focus:bg-[var(--input-focus)] rounded-xl px-4 py-3 text-sm text-[var(--txt)] focus:outline-none transition-all placeholder:text-[var(--txt-2)] font-inter"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--txt-2)] mb-1.5">MESSAGE</label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Details about your system scope, timeline, or position..."
                className="w-full bg-[var(--input)] border border-[var(--bd)] focus:border-[var(--color-accent)] focus:bg-[var(--input-focus)] rounded-xl px-4 py-3 text-sm text-[var(--txt)] focus:outline-none transition-all resize-none placeholder:text-[var(--txt-2)] font-inter"
              />
            </div>

            {status && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl text-xs font-mono ${
                  status.type === 'success'
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}
              >
                {status.message}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-12 rounded-xl border border-[var(--color-accent)]/40 bg-transparent overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(0,255,194,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
            >
              <span
                className={`absolute inset-0 w-full h-full bg-[var(--color-accent)] pointer-events-none transition-transform duration-500 ease-out ${
                  loading ? 'translate-y-0' : 'translate-y-[102%] group-hover:translate-y-0'
                }`}
              />

              <span
                className={`relative z-10 w-full h-full flex items-center justify-center gap-2 text-sm font-semibold font-space-grotesk text-[var(--color-accent)] transition-colors duration-300 ${
                  loading ? 'text-black' : 'group-hover:text-black'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Dispatching Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>Send Message</span>
                  </>
                )}
              </span>
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}