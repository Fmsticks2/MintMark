import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  Shield, 
  Zap, 
  Users, 
  Wallet, 
  Globe, 
  CheckCircle, 
  Star,
  Rocket,
  Target,
  TrendingUp,
  Lock,
  Smartphone,
  Monitor,
  Coins,
  Gift,
  BarChart3,
  Settings,
  BookOpen,
  Play,
  ArrowRight,
  X
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenOnboarding');
    if (seen === 'true') {
      setHasSeenOnboarding(true);
      onComplete();
    }
  }, [onComplete]);

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    onComplete();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to MintMark',
      subtitle: 'The Future of Digital Credentials & Event Verification',
      content: (
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center">
              <Award className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Transform Your Events & Certifications
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create verifiable proof-of-attendance tokens (POAPs) and professional certificates 
              on the blockchain. Build trust, engage communities, and unlock new possibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Blockchain Verified</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Immutable proof on Aptos blockchain</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Instant minting and verification</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Community Driven</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Build engaged communities</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Powerful Features',
      subtitle: 'Everything you need to create, manage, and verify digital credentials',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">POAP NFTs</CardTitle>
                    <CardDescription>Proof of Attendance Tokens</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Create unique event tokens</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Customizable designs & metadata</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Automated distribution</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Community engagement tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Digital Certificates</CardTitle>
                    <CardDescription>Professional Credentials</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Custom certificate templates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Bulk issuance & management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Instant verification</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Expiration & revocation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4 text-center">Advanced Platform Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Analytics</p>
              </div>
              <div className="text-center">
                <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">API Access</p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">White Label</p>
              </div>
              <div className="text-center">
                <Lock className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Enterprise Security</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wallet-setup',
      title: 'Connect Your Wallet',
      subtitle: 'Secure blockchain integration for minting and verification',
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-400 to-pink-600 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
              <Wallet className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4">Choose Your Wallet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Connect a supported Aptos wallet to start minting POAPs and certificates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardContent className="p-6 text-center">
                <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                  <img src="/petra-logo.svg" alt="Petra" className="w-8 h-8" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                  }} />
                  <Wallet className="w-8 h-8 text-orange-600 hidden" />
                </div>
                <h4 className="font-semibold mb-2">Petra Wallet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Most popular Aptos wallet</p>
                <Badge variant="secondary">Recommended</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                  <img src="/martian-logo.svg" alt="Martian" className="w-8 h-8" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                  }} />
                  <Wallet className="w-8 h-8 text-purple-600 hidden" />
                </div>
                <h4 className="font-semibold mb-2">Martian Wallet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Feature-rich wallet</p>
                <Badge variant="outline">Supported</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                  <img src="/pontem-logo.svg" alt="Pontem" className="w-8 h-8" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                  }} />
                  <Wallet className="w-8 h-8 text-blue-600 hidden" />
                </div>
                <h4 className="font-semibold mb-2">Pontem Wallet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Secure & reliable</p>
                <Badge variant="outline">Supported</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Mobile & Desktop Support</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Our platform automatically detects and connects to available wallets on both mobile and desktop devices. 
                  You can switch between devices seamlessly while maintaining your credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pricing',
      title: 'Choose Your Plan',
      subtitle: 'Flexible pricing for individuals, teams, and enterprises',
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-400 to-blue-600 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4">Start Free, Scale as You Grow</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="text-center">
                  <h4 className="text-lg font-bold">Starter</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">Free</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Perfect for getting started</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>3 events per month</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>100 POAPs per event</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Basic templates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Community support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <div className="text-center">
                  <h4 className="text-lg font-bold">Professional</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$10</span>
                    <span className="text-gray-600 dark:text-gray-300">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">For growing organizations</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>25 events per month</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>500 POAPs per event</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-purple-200 dark:border-purple-700">
              <CardHeader>
                <div className="text-center">
                  <h4 className="text-lg font-bold">Enterprise</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">Custom</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">For large organizations</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Unlimited events</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Unlimited POAPs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>White-label solution</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Gift className="w-8 h-8 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Special Launch Offer</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Get 50% off your first 3 months on any paid plan. Use code <code className="bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded">LAUNCH50</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: 'You\'re All Set!',
      subtitle: 'Start creating amazing digital experiences',
      content: (
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-400 to-blue-600 rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center">
              <Rocket className="w-16 h-16 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ready to Launch!
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              You're now ready to create your first POAP event or certificate template. 
              Let's build something amazing together!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Create Your First Event</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Set up an event and start minting POAPs for your attendees
                </p>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Build Certificate Template</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Design professional certificates for your organization
                </p>
                <Button className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Build Template
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h4 className="font-semibold mb-4">Quick Start Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Documentation</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Complete guides & tutorials</p>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Community</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Join our Discord community</p>
              </div>
              <div className="text-center">
                <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Support</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Get help when you need it</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (hasSeenOnboarding && !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-auto"
        >
          {/* Skip Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                </span>
              </div>
              <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-screen flex items-center justify-center p-4 pt-20 pb-20">
            <div className="max-w-6xl mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                      {steps[currentStep].title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                      {steps[currentStep].subtitle}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="max-w-5xl mx-auto">
                    {steps[currentStep].content}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-blue-600'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextStep}
                className="flex items-center space-x-2"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                {currentStep === steps.length - 1 ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Onboarding;