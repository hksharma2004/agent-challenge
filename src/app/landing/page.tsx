'use client';

import React, { useState, useEffect } from 'react';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlurFade } from '@/components/ui/blur-fade';
import HeroAscii from '@/components/hero-ascii';
import { LandingNavBar } from '@/components/navigation/LandingNavBar';
import { ClippedAreaChart } from '@/components/charts/ClippedAreaChart';
import { Button } from '@/components/ui/button';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { Card } from '@/components/ui/card';

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <GooeyText
          texts={["Loading", "DecentraCode", "Please", "Wait"]}
          morphTime={1}
          cooldownTime={0.25}
          className="font-bold text-primary"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-y-auto">
      <LandingNavBar />


      <section id="home" className="pt-16 py-16 md:py-20">
        <HeroAscii
          text="DECENTRACODE"
          subtitle="Decentralized Code Review Platform powered by AI and a community of verified developers."
        />

        <BlurFade delay={0.2} inView>
          <div className="max-w-2xl mx-auto mt-10 flex justify-center gap-4 px-4">
            <Link href="/signup" passHref>
              <Button className="bg-[#4CAF50] text-white hover:bg-[#45a049] transition-colors duration-300 px-8 py-6 text-base">
                Sign Up
              </Button>
            </Link>
            <Link href="/signin" passHref>
              <Button variant="outline" className="border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors duration-300 px-8 py-6 text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </BlurFade>
      </section>


      <BlurFade delay={0.2} inView>
        <section id="problem" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Card className="border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 p-6 sm:p-8 md:p-10">
            <p className="text-sm font-mono uppercase text-neutral-700 mb-3">
              {'>'}_ PROBLEM_STATEMENT.JSON
            </p>
            <hr className="mb-6 border-neutral-300 dark:border-neutral-700" />
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-4">
              The Problem with Traditional Code Reviews
            </h2>
            <div className="max-w-3xl text-neutral-600 leading-relaxed text-base space-y-4">
              <p>
                Code reviews are often slow, inconsistent, and limited by availability. Developers spend hours waiting for feedback, reviewers juggle context switching, and valuable insights get lost across threads.
              </p>
              <p>
                DecentraCode fixes that by combining automated AI agents with verified reviewers. You get structured analysis, consistent feedback, and a transparent credit-based system that rewards contributors fairly.
              </p>
            </div>
          </Card>
        </section>
      </BlurFade>


      <BlurFade delay={0.2} inView>
        <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Card className="border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 p-6 sm:p-8 md:p-10">
            <p className="text-sm font-mono uppercase text-neutral-700 mb-3">
              {'>'}_ HOW_IT_WORKS.JSON
            </p>
            <hr className="mb-6 border-neutral-300 dark:border-neutral-700" />
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-8">
              How DecentraCode Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '📝', title: '1. Submit Your Code', desc: 'Upload your repository or paste snippets. DecentraCode automatically detects your stack.' },
                { icon: '🤖', title: '2. AI + Human Review', desc: 'Mastra agents perform initial analysis. Verified reviewers refine insights and provide feedback.' },
                { icon: '📈', title: '3. Track, Improve, Repeat', desc: 'View reports, earn/spend credits, and iterate confidently with every submission.' }
              ].map((item, idx) => (
                <div key={idx} className="relative p-8 border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 overflow-hidden rounded-lg">
                  <DottedGlowBackground
                    className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
                    opacity={0.5}
                    gap={10}
                    radius={1.6}
                    colorLightVar="--color-neutral-500"
                    glowColorLightVar="--color-neutral-600"
                    colorDarkVar="--color-neutral-500"
                    glowColorDarkVar="--color-sky-800"
                    backgroundOpacity={0}
                    speedMin={0.3}
                    speedMax={1.6}
                    speedScale={1}
                  />
                  <div className="relative z-10">
                    <div className="mb-6 text-5xl">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">{item.title}</h3>
                    <p className="text-neutral-600 leading-relaxed text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </BlurFade>


      <BlurFade delay={0.2} inView>
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Card className="border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 p-6 sm:p-8 md:p-10">
            <p className="text-sm font-mono uppercase text-neutral-700 mb-3">
              {'>'}_ FEATURES_DATABASE.JSON
            </p>
            <hr className="mb-6 border-neutral-300 dark:border-neutral-700" />
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-8">
              Built for Developers Who Value Quality
            </h2>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {[
                { title: 'AI-Powered Code Analysis', desc: 'Uses agent-based workflows to detect issues and recommend improvements.' },
                { title: 'Peer Review Network', desc: 'Connects you with experienced developers who verify and enrich AI findings.' },
                { title: 'Credit & Staking System', desc: 'Fairly rewards reviewers and gives users control through transparent credit usage.' },
                { title: 'Real-Time Collaboration', desc: 'Chat, comment, and iterate on reviews directly in your dashboard.' },
                { title: 'Unified Dashboard', desc: 'Manage your submissions, reviews, and credits from one clean interface.' },
                { title: 'Secure Authentication', desc: 'Powered by Supabase, ensuring privacy and data integrity at every step.' }
              ].map((feature, idx) => (
                <div key={idx} className="relative p-8 border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 overflow-hidden rounded-lg">
                  <DottedGlowBackground
                    className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
                    opacity={0.5}
                    gap={10}
                    radius={1.6}
                    colorLightVar="--color-neutral-500"
                    glowColorLightVar="--color-neutral-600"
                    colorDarkVar="--color-neutral-500"
                    glowColorDarkVar="--color-sky-800"
                    backgroundOpacity={0}
                    speedMin={0.3}
                    speedMax={1.6}
                    speedScale={1}
                  />
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                    <p className="text-neutral-600 leading-relaxed text-base">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </BlurFade>


      <BlurFade delay={0.2} inView>
        <section id="metrics" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Card className="border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 p-6 sm:p-8 md:p-10">
            <h2 className="text-3xl md:text-4xl font-mono font-semibold mb-4">Code Health Metrics</h2>
            <p className="text-base md:text-lg text-neutral-600 font-mono leading-relaxed mb-12">
              Track key metrics like code quality and security vulnerabilities over time.
            </p>
            <div className="flex flex-col md:flex-row justify-center">
              <ClippedAreaChart />
            </div>
          </Card>
        </section>
      </BlurFade>

      <BlurFade delay={0.2} inView>
        <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Card className="border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 p-6 sm:p-8 md:p-10">
            <p className="text-sm font-mono uppercase text-neutral-700 mb-3">
              {'>'}_ PRICING_PLANS.JSON
            </p>
            <hr className="mb-6 border-neutral-300 dark:border-neutral-700" />
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-8">
              Flexible Pricing for Every Developer
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Free Tier', price: '$0', features: ['Basic AI Review', 'Limited Submissions', 'Community Support'] },
                { title: 'Pro Tier', price: '$29/month', features: ['Advanced AI Review', 'Unlimited Submissions', 'Priority Support', 'Human Review Credits'] },
                { title: 'Enterprise', price: 'Custom', features: ['All Pro Features', 'Dedicated Account Manager', 'SLA', 'On-Premise Options'] }
              ].map((plan, idx) => (
                <div key={idx} className="relative p-8 border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 overflow-hidden rounded-lg text-center">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">{plan.title}</h3>
                  <p className="text-4xl font-bold text-neon-green mb-6">{plan.price}</p>
                  <ul className="text-neutral-600 space-y-2 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx}>{feature}</li>
                    ))}
                  </ul>
                  <Button className="bg-neon-green text-black hover:bg-neon-green/80 focus-visible:ring-neon-green">
                    Choose Plan
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </BlurFade>


      <BlurFade delay={0.2} inView>
        <section id="testimonials" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Card className="border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 p-6 sm:p-8 md:p-10">
            <p className="text-sm font-mono uppercase text-neutral-700 mb-3">
              {'>'}_ COMMUNITY_REVIEWS.JSON
            </p>
            <hr className="mb-6 border-neutral-300 dark:border-neutral-700" />
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-8">
              Trusted by Early Adopters
            </h2>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { quote: "DecentraCode has revolutionized our review process. The AI suggestions combined with human oversight save us countless hours.", author: "Alex P., Lead Developer at InnovateX" },
                { quote: "The credit system is brilliant. It incentivizes quality reviews and creates a truly engaged community.", author: "Jamie L., Open Source Contributor" },
                { quote: "Finally, a platform that makes code reviews transparent and efficient. A game-changer for our team.", author: "Casey R., CTO of DevSolutions" }
              ].map((testimonial, idx) => (
                <div key={idx} className="relative p-8 border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 rounded-lg flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-mono text-green-600 bg-green-100 dark:bg-green-900/40 px-3 py-1.5 rounded-full inline-block mb-6">
                      SPECIAL
                    </span>
                    <p className="text-neutral-600 leading-relaxed text-base mb-6">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <p className="text-sm text-neutral-500 font-medium">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </BlurFade>


      <BlurFade delay={0.2} inView>
        <section id="join-us" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <Card className="border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 p-10 sm:p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-6">
              Write Better Code, Together.
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10">
              Join DecentraCode and experience transparent, AI-augmented code reviews designed for modern developers.
            </p>
            <Link href="/signup" passHref>
              <Button className="bg-[#4CAF50] px-10 py-6 rounded-xl text-white text-lg hover:bg-[#45a049] transition-colors duration-300 shadow-lg hover:shadow-xl">
                Get Started
              </Button>
            </Link>
          </Card>
        </section>
      </BlurFade>


      <footer className="border-t border-neutral-200/40 py-12 px-4 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} DecentraCode. All rights reserved.
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <a href="#" className="hover:text-neutral-900 hover:underline transition-colors duration-200">About</a>
            <a href="#" className="hover:text-neutral-900 hover:underline transition-colors duration-200">Docs</a>
            <a href="#" className="hover:text-neutral-900 hover:underline transition-colors duration-200">GitHub</a>
            <a href="#" className="hover:text-neutral-900 hover:underline transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-neutral-900 hover:underline transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-neutral-900 hover:underline transition-colors duration-200">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
