'use client'
import { useState, useEffect } from 'react';
import Header from "@/components/ui/header";
import LandingPage from '../app/landing-page/page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, BarChart3 } from 'lucide-react';
import AnimatedIntro from "@/components/AnimatedIntro";

export default function ClientHome({ session }: { session: any }) {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const alreadyShown = localStorage.getItem("ai-form-intro-shown");
      if (!alreadyShown) {
        setShowIntro(true);
      }
    }
  }, []);

  const handleIntroFinish = () => {
    localStorage.setItem("ai-form-intro-shown", "true");
    setShowIntro(false);
  };

  if (showIntro) {
    return <AnimatedIntro onFinish={handleIntroFinish} />;
  }

  return (
    <>
      <Header session={session} />
      <main className="flex min-h-screen flex-col items-center">
        {session?.user ? (
          <div className="w-full max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Welcome back, {session.user.name?.split(' ')[0]}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Build professional forms and analyze responses with comprehensive business intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/form-generator">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Form
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="hover:bg-emerald-50 hover:border-emerald-200">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            {/* ...rest of your authenticated user UI... */}
          </div>
        ) : (
          <LandingPage />
        )}
      </main>
    </>
  );
}