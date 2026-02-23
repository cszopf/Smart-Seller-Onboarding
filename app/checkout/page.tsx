'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const logoUrl = "https://lh7-rt.googleusercontent.com/docsz/AD_4nXeSb6s_P3nXRrs9OUquQgATijkDX14cEdeK7kfFUFKVOvUMVife1HmNbLBMS4EQ8b5nKM-enx639-uc6mZ1b9kQbj41a6g4HwvAQPWZVHqq7Ity6k9n7AMSqCQVe-TAnBOOSaJcAhUrAuLw6bnSVj9pQYPDIw?key=kl0MF71HcvaAWt9zvK_MLQ";

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      router.push('/onboard?invoiceId=inv_123&sessionId=cs_test_123');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Side: Payment Form */}
      <div className="flex-1 p-8 md:p-16 lg:p-24 bg-white">
        <div className="max-w-md mx-auto">
          <div className="mb-12">
            <div className="relative w-48 h-12 mb-8">
              <Image 
                src={logoUrl}
                alt="World Class Title Logo"
                fill
                className="object-contain object-left"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
            <p className="text-gray-500">Prototype Demo: No real payment will be processed.</p>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="ashley.spencer@cbrealty.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Card Information</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="MM / YY"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <input 
                    type="text" 
                    placeholder="CVC"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name on Card</label>
                <input 
                  type="text" 
                  defaultValue="Ashley Spencer"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              disabled={processing}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay $348.00
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 font-medium pt-4">
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Secure SSL Encryption</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Powered by Prototype</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Order Summary */}
      <div className="w-full md:w-[400px] bg-gray-100 p-8 md:p-16 border-l border-gray-200">
        <div className="max-w-xs mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-8">Order Summary</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900">Gold Package</p>
                <p className="text-sm text-gray-500">Marketing Campaign #1</p>
              </div>
              <p className="font-bold text-gray-900">$348.00</p>
            </div>
            
            <div className="pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">$348.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">$348.00</span>
              </div>
            </div>
          </div>

          <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Note:</strong> After payment, you will be prompted to verify your identity to begin the secure title onboarding process for your client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
