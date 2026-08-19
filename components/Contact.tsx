'use client';

import { HomeViewData } from '@/lib/data';
import { motion } from 'framer-motion';
import { Github, Linkedin, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Magnetic } from './Magnetic';

interface ContactProps {
  data: HomeViewData;
}

export function Contact({ data }: ContactProps) {
  const contacts = [
    {
      icon: <Github size={22} />,
      label: 'GitHub',
      value: data.Github || 'https://github.com/VicoAritonang',
      color: 'hover:text-white hover:border-white/40',
      glow: 'hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]',
    },
    {
      icon: <Linkedin size={22} />,
      label: 'LinkedIn',
      value: data.linkedIn,
      color: 'hover:text-blue-400 hover:border-blue-400/40',
      glow: 'hover:shadow-[0_0_25px_rgba(96,165,250,0.25)]',
    },
    {
      icon: <MessageCircle size={22} />,
      label: 'WhatsApp',
      value: data.whatsapp ? `https://wa.me/${data.whatsapp}` : null,
      color: 'hover:text-green-400 hover:border-green-400/40',
      glow: 'hover:shadow-[0_0_25px_rgba(74,222,128,0.25)]',
    },
  ];

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-28 pb-16 sm:pb-20 relative z-10 overflow-hidden">
      {/* Top divider line */}
      <div className="absolute top-0 inset-x-8 sm:inset-x-16 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[10px] sm:text-xs text-cyan-500/60 tracking-[0.3em] mb-4 sm:mb-6"
        >
          [ 02 / TRANSMISSION ]
        </motion.div>

        {/* Giant CTA heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.05]"
        >
          <span className="block text-white/90">Let's build</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-[length:200%_auto] animate-[border-flow_5s_ease_infinite]">
            something together.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto mb-10 sm:mb-14"
        >
          Currently open for internships, freelance projects, and full-time opportunities.
          Signal received 24/7 — response guaranteed.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {contacts.map((contact, index) => (
            contact.value && (
              <Magnetic key={contact.label} strength={0.3}>
                <motion.a
                  href={contact.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group flex items-center gap-3 px-5 sm:px-7 py-3 sm:py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 transition-all duration-300 ${contact.color} ${contact.glow} active:scale-95`}
                >
                  {contact.icon}
                  <span className="font-mono text-xs sm:text-sm tracking-wider">{contact.label}</span>
                  <ArrowUpRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                </motion.a>
              </Magnetic>
            )
          ))}
        </div>

        {/* Footer bar */}
        <div className="mt-16 sm:mt-24 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-600 text-xs sm:text-sm font-mono">
          <span>© {new Date().getFullYear()} VICO.WORKS — All systems nominal.</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Built with Next.js & Supabase
          </span>
        </div>
      </div>
    </section>
  );
}
