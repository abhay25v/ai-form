import React from 'react'
import Image from 'next/image'
import FormGenerator from '../form-generator'
import PlausibleProvider from 'next-plausible'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Zap, BarChart3, Share2, Clock, Users } from 'lucide-react'
import Link from 'next/link'

type Props = {}

const LandingPage = (props: Props) => {
  return (
    <PlausibleProvider domain={process.env.PLAUSIBLE_DOMAIN || ""}>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-8 pt-8 sm:pt-24 pb-16 w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 bg-[url('/grid.svg')] bg-opacity-50" id="hero">
        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Form Builder
          </div>
          <h1 className='text-4xl font-bold text-center tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent'>
            Create your forms <br />in seconds not hours
          </h1>
          <p className='max-w-[600px] mx-auto text-lg text-center text-gray-600 md:text-xl leading-relaxed'>
            Generate, publish and share your form right away with AI. Dive into insightful results, charts and analytics.
          </p>
        </div>
        
        <div className="w-full max-w-2xl px-4">
          <FormGenerator />
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 mt-12">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Create forms in seconds with AI assistance</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Rich Analytics</h3>
              <p className="text-sm text-gray-600">Get detailed insights and analytics</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Share2 className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Easy Sharing</h3>
              <p className="text-sm text-gray-600">Share and collect responses instantly</p>
            </CardContent>
          </Card>
        </div>
        
        <div className='w-full bg-gradient-to-b from-transparent to-white h-24'></div>
      </section>
      {/* How It Works Section */}
      <section className='flex flex-col items-center justify-center space-y-12 py-24 bg-gray-50' id="features">
        <div className="text-center space-y-4">
          <h2 className='text-3xl font-bold text-center tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create professional forms in just three simple steps with our AI-powered platform
          </p>
        </div>
        
        <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto px-4'>
          <Card className="relative overflow-hidden border-none shadow-xl bg-white group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="relative">
                  <Image
                    src="/images/app/demo1.png"
                    width="280"
                    height="280"
                    alt="create a form"
                    className='w-full h-auto rounded-lg shadow-md'
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">Describe Your Form</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Simply describe what kind of form you need and our AI will understand your requirements
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-xl bg-white group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="relative">
                  <Image
                    src="/images/app/demo4.png"
                    width="280"
                    height="280"
                    alt="generate the form"
                    className='w-full h-auto rounded-lg shadow-md'
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">AI Generates Your Form</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Watch as our AI instantly creates a professional form with all the right fields and styling
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-xl bg-white group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="relative">
                  <Image
                    src="/images/app/demo4.png"
                    width="280"
                    height="280"
                    alt="check analytics"
                    className='w-full h-auto rounded-lg shadow-md'
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">Analyze & Share</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Share your form and get detailed analytics on responses, completion rates, and more
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900">Ready to get started?</h3>
          <p className="text-gray-600">Join thousands of users who create amazing forms with AI</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PlausibleProvider>
  )
}

export default LandingPage