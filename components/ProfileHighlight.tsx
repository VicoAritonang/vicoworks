'use client';

import { HomeViewData } from '@/lib/data';
import { motion } from 'framer-motion';
import { Globe, ArrowUpRight, Mail, MapPin, Check } from 'lucide-react';
import { useState } from 'react';

interface ProfileHighlightProps {
    data: HomeViewData;
}

export function ProfileHighlight({ data }: ProfileHighlightProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('vicoaritonang5@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-12 sm:py-16 relative z-10">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">

                    {/* Card 1: Location */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-xl group-hover:bg-cyan-500/20 transition-colors duration-300" />
                        <div className="relative p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-black/40 backdrop-blur-md hover:border-cyan-500/60 transition-all duration-300 h-full flex flex-col gap-4 cursor-default">
                            {/* Top label */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono tracking-widest w-fit">
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                                LOCATION.DATA
                            </div>

                            {/* Main content */}
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-full bg-cyan-500/10 text-cyan-400 shrink-0">
                                    <MapPin size={24} className="sm:w-8 sm:h-8" />
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                                        Indonesia
                                    </div>
                                    <div className="text-cyan-400/70 text-xs sm:text-sm uppercase tracking-wider">
                                        Based In
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2 text-gray-400 text-sm border-l-2 border-cyan-500/30 pl-3">
                                <Globe size={16} className="text-cyan-500 shrink-0" />
                                <span>Open to international opportunities</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-purple-500/10 rounded-2xl blur-xl group-hover:bg-purple-500/20 transition-colors duration-300" />
                        <div className="relative p-6 sm:p-8 rounded-2xl border border-purple-500/30 bg-black/40 backdrop-blur-md hover:border-purple-500/60 transition-all duration-300 h-full flex flex-col gap-4 cursor-default">
                            {/* Top label */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-purple-950/30 border border-purple-500/30 text-purple-400 text-[10px] font-mono tracking-widest w-fit">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                                CONTACT.INFO
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-full bg-purple-500/10 text-purple-400 shrink-0">
                                    {copied ? <Check size={24} className="sm:w-8 sm:h-8" /> : <Mail size={24} className="sm:w-8 sm:h-8" />}
                                </div>
                                <div className="min-w-0">
                                    <button
                                        onClick={handleCopy}
                                        className="font-mono text-sm sm:text-base text-white truncate hover:text-purple-400 transition-colors text-left"
                                        title="Click to copy"
                                    >
                                        vicoaritonang5@gmail.com
                                    </button>
                                    <div className="text-purple-400/70 text-xs sm:text-sm uppercase tracking-wider">
                                        {copied ? 'Copied to clipboard!' : 'Email'}
                                    </div>
                                </div>
                            </div>

                            {/* Resume */}
                            {data.resume_url && (
                                <a
                                    href={data.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn flex items-center gap-2 border-l-2 border-purple-500/30 pl-3 text-purple-400 hover:text-purple-300 transition-colors w-fit text-sm font-medium"
                                >
                                    <ArrowUpRight
                                        size={16}
                                        className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform shrink-0"
                                    />
                                    View My Resume
                                </a>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}