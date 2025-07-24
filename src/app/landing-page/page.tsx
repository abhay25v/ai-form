import React from 'react'
import Image from 'next/image'
import FormGenerator from '../form-generator'
import PlausibleProvider from 'next-plausible'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, BarChart3, Share2, Clock } from 'lucide-react'
import Link from 'next/link'


const LandingPage = () => {
  return (
    <PlausibleProvider domain={process.env.PLAUSIBLE_DOMAIN || ""}>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-8 pt-8 sm:pt-24 pb-16 w-full bg-gradient-to-br from-emerald-50 via-white to-teal-50 bg-[url('/grid.svg')] bg-opacity-50" id="hero">
        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Form Builder
          </div>
          <h1 className='text-4xl font-bold text-center tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent'>
            Create professional forms <br />with intelligent automation
          </h1>
          <p className='max-w-[600px] mx-auto text-lg text-center text-gray-600 md:text-xl leading-relaxed'>
            Build, publish, and analyze professional forms with AI-powered automation. Streamline data collection with intelligent insights and comprehensive analytics.
          </p>
        </div>
        
        <div className="w-full text-center max-w-2xl px-4">
          <FormGenerator />
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 mt-12">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Rapid Development</h3>
              <p className="text-sm text-gray-600">Accelerate form creation with intelligent automation</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-sm text-gray-600">Comprehensive insights and data visualization</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Share2 className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Seamless Distribution</h3>
              <p className="text-sm text-gray-600">Efficient sharing and response collection</p>
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
            Build professional forms efficiently with our enterprise-grade AI platform
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
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">Define Requirements</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Specify your form requirements, target audience, and data collection objectives
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
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
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">AI-Powered Generation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Advanced AI algorithms create optimized forms with intelligent field types and validation
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full"></div>
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
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">Deploy & Analyze</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Distribute your forms and leverage comprehensive analytics for data-driven insights
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900">Ready to streamline your data collection?</h3>
          <p className="text-gray-600">Join enterprise teams who trust our platform for professional form management</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold shadow-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-semibold hover:bg-emerald-50 hover:border-emerald-200">
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