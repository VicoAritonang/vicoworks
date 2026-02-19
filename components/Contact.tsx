'use client';

import { HomeViewData } from '@/lib/data';
import { motion } from 'framer-motion';
import { Github, Linkedin, MessageCircle } from 'lucide-react';

interface ContactProps {
  data: HomeViewData;
}

export function Contact({ data }: ContactProps) {
  const contacts = [
    {
      icon: <Github size={24} />,
      label: 'GitHub',
      value: data.Github || 'https://github.com/VicoAritonang', // Fallback if DB is empty 
      color: 'hover:text-white',
      bg: 'hover:bg-gray-800'
    },
    {
      icon: <Linkedin size={24} />,
      label: 'LinkedIn',
      value: data.linkedIn,
      color: 'hover:text-blue-400',
      bg: 'hover:bg-blue-900/30'
    },
    {
      icon: <MessageCircle size={24} />,
      label: 'WhatsApp',
      value: data.whatsapp ? `https://wa.me/${data.whatsapp}` : null,
      color: 'hover:text-green-400',
      bg: 'hover:bg-green-900/30'
    },
    // Gmail removed as per request
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 pb-20 sm:pb-24 md:pb-32 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600"
        >
          Let's Connect
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {contacts.map((contact, index) => (
            contact.value && (
              <motion.a
                key={contact.label}
                href={contact.value}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 transition-all duration-300 ${contact.color} ${contact.bg} hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95`}
              >
                {contact.icon}
                <span className="sr-only">{contact.label}</span>
              </motion.a>
            )
          ))}
        </div>

        <div className="mt-12 sm:mt-16 md:mt-20 text-gray-600 text-xs sm:text-sm">
          © {new Date().getFullYear()} Portfolio. Built with Next.js & Supabase.
        </div>
      </div>
    </section>
  );
}
