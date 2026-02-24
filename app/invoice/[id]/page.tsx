'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Clock, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export default function InvoicePage() {
  const router = useRouter();
  const logoUrl = "https://lh7-rt.googleusercontent.com/docsz/AD_4nXeSb6s_P3nXRrs9OUquQgATijkDX14cEdeK7kfFUFKVOvUMVife1HmNbLBMS4EQ8b5nKM-enx639-uc6mZ1b9kQbj41a6g4HwvAQPWZVHqq7Ity6k9n7AMSqCQVe-TAnBOOSaJcAhUrAuLw6bnSVj9pQYPDIw?key=kl0MF71HcvaAWt9zvK_MLQ";
  const headshotUrl = "https://lh7-rt.googleusercontent.com/docsz/AD_4nXe6Tb9_rjAZXJBDcY-fBLjF8XZn3Bn0oPyVdKgW1C-uXIAornHsxant93RXuSqKpn9n2ID1nMkXU3fClBfbDbslzdfoq3sEMopFyibq-__ibq4MoOGtHRku0tjKeKvYeqyoKfkNAoxHdHr8s_KbEJl-O8Yq_Bo?key=kl0MF71HcvaAWt9zvK_MLQ";

  const handlePayNow = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col">
      <div className="bg-[#004EA8] text-white py-2 px-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] sticky top-0 z-50 shadow-sm">
        Prototype: Real Estate Agent Experience
      </div>
      <div className="flex-1 flex flex-col items-center py-12 px-4">
      {/* Email Header Simulation */}
      <div className="max-w-3xl w-full mb-8 flex items-center justify-between text-gray-400 text-sm border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white overflow-hidden">
            <Image src={headshotUrl} alt="Chris" width={40} height={40} className="object-cover" />
          </div>
          <div>
            <p className="font-bold text-white">Chris Sauerzopf</p>
            <p>Payment Request for Marketing Campaign #1</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>Inbox</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl border border-white/5"
      >
        {/* Logo Section */}
        <div className="bg-white p-12 flex justify-center">
          <div className="relative w-64 h-24">
            <Image 
              src={logoUrl}
              alt="World Class Title Logo"
              fill
              className="object-contain"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-12 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Dear Alex Sterling,</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We are writing to coordinate the payment for your upcoming <span className="font-bold text-white uppercase tracking-wider">Gold Package</span> marketing campaign.
            </p>
            <div className="space-y-1">
              <p className="text-gray-300 text-lg">
                For Property: <span className="font-bold text-white uppercase tracking-wider">1234 Hight Street, Columbus OH</span>
              </p>
              <p className="text-gray-300 text-lg">
                Seller: <span className="font-bold text-white uppercase tracking-wider">Jane Smith</span>
              </p>
            </div>
          </div>

          <div className="bg-[#333333] rounded-xl p-8 border border-white/5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Package Details</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <p className="font-bold text-white">Add-ons:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
                  <li>Talking Video with agent</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center space-y-8 py-4">
            <div className="space-y-1">
              <p className="text-4xl font-bold text-[#4ADE80]">Total Due: $348.00</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handlePayNow}
                className="w-full max-w-sm mx-auto bg-[#CCFF00] text-black font-bold py-5 rounded-xl hover:bg-[#b8e600] transition-all flex items-center justify-center gap-3 text-xl shadow-lg shadow-black/20"
              >
                <CreditCard className="h-6 w-6" />
                Pay Now
              </button>
              
              <div className="flex flex-col items-center gap-2 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>This payment link expires in 24 hours.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Rep Footer */}
          <div className="pt-8 border-t border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
              <Image src={headshotUrl} alt="Chris Sauerzopf" width={48} height={48} className="object-cover" />
            </div>
            <div className="text-sm">
              <p className="font-bold text-white">Chris Sauerzopf</p>
              <p className="text-gray-400">World Class Title Representative</p>
              <p className="text-[#CCFF00] font-bold mt-1">Have a question, reach out.</p>
              <div className="flex gap-3 mt-1 text-gray-500">
                <a href="mailto:chris@worldclasstitle.com" className="hover:text-[#CCFF00]">chris@worldclasstitle.com</a>
                <span>•</span>
                <span>614.444.4444</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-12 max-w-2xl w-full text-center space-y-4 text-gray-500 text-sm">
        <p>© 2026 World Class Title. All rights reserved.</p>
      </div>
      </div>
    </div>
  );
}
