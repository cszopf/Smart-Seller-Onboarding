'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, CreditCard, UserPlus } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const logoUrl = "https://images.squarespace-cdn.com/content/v1/5f4d40b11b4f1e6a11b920b5/1598967776211-2JVFU1R4U8PQM71BWUVE/WorldClassTitle_Logos-RGB-Primary.png?format=1500w";

  const startDemo = () => {
    // Simulate a successful checkout redirect
    router.push('/onboard?invoiceId=inv_123&sessionId=cs_test_123');
  };

  const startDirectOnboarding = () => {
    // Direct link onboarding
    router.push('/onboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-64 h-24 mb-4">
            <Image 
              src={logoUrl}
              alt="World Class Title Logo"
              fill
              className="object-contain"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-sm font-bold tracking-[0.15em] text-[#004EA8] uppercase font-nunito">
            Smart Onboarding
          </h1>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-12 border border-blue-50">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-nunito leading-tight uppercase tracking-[0.15em]">
            Production <br />
            <span className="text-[#004EA8]">Prototype Demo</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto font-nunito">
            Experience the seamless transition from marketing invoice payment to secure agent verification and homeowner handoff.
          </p>

          <div className="space-y-4">
            <button
              onClick={startDemo}
              className="group w-full bg-[#004EA8] text-white font-bold py-5 rounded-2xl hover:bg-[#003d82] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 text-lg uppercase tracking-wider"
            >
              <CreditCard className="h-6 w-6" />
              Simulate Payment Success
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={startDirectOnboarding}
              className="group w-full bg-white text-[#004EA8] border-2 border-[#004EA8] font-bold py-5 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-wider"
            >
              <UserPlus className="h-6 w-6" />
              Direct Onboarding Link
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-400 font-medium font-nunito">
              Starts the flow at <code className="bg-gray-100 px-2 py-1 rounded">/onboard</code>
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6">
            <h4 className="font-bold text-gray-900 mb-2 uppercase text-[10px] tracking-[0.15em] text-[#004EA8] font-montserrat">Phase 1</h4>
            <p className="text-sm text-gray-600 font-medium font-nunito">Payment confirmation (optional)</p>
          </div>
          <div className="p-6">
            <h4 className="font-bold text-gray-900 mb-2 uppercase text-[10px] tracking-[0.15em] text-[#004EA8] font-montserrat">Phase 2</h4>
            <p className="text-sm text-gray-600 font-medium font-nunito">Stripe Identity verification for agents</p>
          </div>
          <div className="p-6">
            <h4 className="font-bold text-gray-900 mb-2 uppercase text-[10px] tracking-[0.15em] text-[#004EA8] font-montserrat">Phase 3</h4>
            <p className="text-sm text-gray-600 font-medium font-nunito">Homeowner details & secure handoff</p>
          </div>
        </div>
      </div>
    </div>
  );
}
