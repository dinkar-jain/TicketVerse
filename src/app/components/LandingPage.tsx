'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Link from "next/link"

import { ReactNode } from 'react';

const AnimatedSection = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })
    const controls = useAnimation()

    useEffect(() => {
        if (isInView) {
            controls.start("visible")
        }
    }, [isInView, controls])

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default function LandingPage(props: { connectMetaMask: () => void; }) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="px-4 lg:px-6 h-16 flex items-center justify-center sm:justify-start border-b border-gray-200">
                <a className="flex items-center justify-center" href="#">
                    <svg className="h-8 w-8 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                        <line x1="6" y1="6" x2="6" y2="6"></line>
                        <line x1="6" y1="18" x2="6" y2="18"></line>
                    </svg>
                    <span className="ml-2 text-2xl font-bold text-gray-800">TicketVerse</span>
                </a>
                <nav className="hidden sm:flex ml-auto gap-6">
                    <a className="text-sm font-medium text-gray-600 hover:text-gray-900" href="#features">
                        Features
                    </a>
                    <a className="text-sm font-medium text-gray-600 hover:text-gray-900" href="#how-it-works">
                        How It Works
                    </a>
                </nav>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <AnimatedSection className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-900">
                                    Event Tickets, Transformed: Own NFTs!
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                                    Prepare for instant access to events with our secure NFT tickets, ensuring every experience is memorable and uniquely yours!                                </p>
                            </div>
                            <div className="space-x-4">
                                <button onClick={props.connectMetaMask} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-gray-900 text-white hover:bg-gray-800 h-10 py-2 px-4">
                                    Get Started
                                </button>
                                <a href="#features" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 h-10 py-2 px-4">
                                    Learn More
                                </a>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <AnimatedSection>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-gray-900">
                                Why Choose TicketVerse?
                            </h2>
                        </AnimatedSection>
                        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                            <AnimatedSection className="flex flex-col items-center space-y-2 border border-gray-200 p-6 rounded-lg">
                                <svg className="h-10 w-10 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900">Secure & Authentic</h3>
                                <p className="text-gray-600 text-center">
                                    NFT technology ensures your tickets are genuine and protected against fraud.
                                </p>
                            </AnimatedSection>
                            <AnimatedSection className="flex flex-col items-center space-y-2 border border-gray-200 p-6 rounded-lg">
                                <svg className="h-10 w-10 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900">Instant Access</h3>
                                <p className="text-gray-600 text-center">
                                    Skip the lines and receive your tickets instantly on your digital wallet.
                                </p>
                            </AnimatedSection>
                            <AnimatedSection className="flex flex-col items-center space-y-2 border border-gray-200 p-6 rounded-lg">
                                <svg className="h-10 w-10 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900">Collectible Memories</h3>
                                <p className="text-gray-600 text-center">
                                    Keep your tickets as digital collectibles long after the event.
                                </p>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
                <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <AnimatedSection>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-gray-900">
                                How It Works
                            </h2>
                        </AnimatedSection>
                        <div className="grid gap-6 lg:grid-cols-3">
                            <AnimatedSection className="flex flex-col items-center space-y-2 border border-gray-200 p-6 rounded-lg bg-white">
                                <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">1</div>
                                <h3 className="text-xl font-bold text-gray-900">Choose Your Event</h3>
                                <p className="text-gray-600 text-center">
                                    Browse our selection of events and select the tickets you want.
                                </p>
                            </AnimatedSection>
                            <AnimatedSection className="flex flex-col items-center space-y-2 border border-gray-200 p-6 rounded-lg bg-white">
                                <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">2</div>
                                <h3 className="text-xl font-bold text-gray-900">Purchase NFT Ticket</h3>
                                <p className="text-gray-600 text-center">
                                    Securely buy your NFT ticket using cryptocurrency payment methods.
                                </p>
                            </AnimatedSection>
                            <AnimatedSection className="flex flex-col items-center space-y-2 border border-gray-200 p-6 rounded-lg bg-white">
                                <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">3</div>
                                <h3 className="text-xl font-bold text-gray-900">Enjoy the Event</h3>
                                <p className="text-gray-600 text-center">
                                    Show your NFT ticket at the venue and create lasting memories.
                                </p>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <AnimatedSection className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Ready to Transform Your Event Experience?
                                </h2>
                                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                                    Join TicketVerse today and step into the future of event ticketing.
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-2">
                                <button onClick={() => { props.connectMetaMask() }} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-white text-gray-900 hover:bg-gray-100 h-10 py-2 px-4" type="submit">
                                    Get Started
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </button>
                                <p className="text-xs text-gray-400">
                                    By signing up, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                    © 2024 TicketVerse. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs text-gray-600 hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs text-gray-600 hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}