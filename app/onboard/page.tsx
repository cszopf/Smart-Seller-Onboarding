'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  UserPlus, 
  ArrowRight, 
  Mail, 
  Smartphone, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Building2,
  MapPin,
  FileText
} from 'lucide-react';
import { Stepper } from '@/components/Stepper';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('invoiceId');
  const sessionId = searchParams.get('sessionId');
  const logoUrl = "https://images.squarespace-cdn.com/content/v1/5f4d40b11b4f1e6a11b920b5/1598967776211-2JVFU1R4U8PQM71BWUVE/WorldClassTitle_Logos-RGB-Primary.png?format=1500w";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [agent, setAgent] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [linkSent, setLinkSent] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);

  // Form states for client info
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (invoiceId && sessionId) {
      // Silent background confirmation to pre-populate data
      confirmInvoice();
    } else {
      // Direct onboarding
      setAgent({
        agentUserId: 'agent_new',
        email: '',
        verificationStatus: 'unverified'
      });
    }
    // Land directly on Step 2 (Verify Identity)
    setStep(2);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId, sessionId]);

  const confirmInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/confirm?invoiceId=${invoiceId}&sessionId=${sessionId}`);
      const data = await res.json();
      if (res.ok) {
        setInvoice(data.invoice);
        setAgent(data.agent);
        // Pre-populate client info if available from invoice/agent context
        setClientInfo(prev => ({
          ...prev,
          address: '123 Listing Lane, Beverly Hills, CA' // Simulated pre-population
        }));
      }
    } catch (err) {
      console.error('Silent confirmation failed:', err);
    }
  };

  const startVerification = async () => {
    setShowVerificationPopup(true);
  };

  const completeVerification = () => {
    setAgent({ ...agent, verificationStatus: 'verified' });
    setStep(3); // Move to client details
    setShowVerificationPopup(false);
  };

  const sendVerificationLink = async (destination: string) => {
    try {
      const res = await fetch('/api/identity/send_link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentUserId: agent.agentUserId, destination }),
      });
      const data = await res.json();
      if (res.ok) {
        setLinkSent(data.link);
        setShowLinkModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitSellerClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/seller-clients/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId,
          agentUserId: agent.agentUserId,
          sellerName: clientInfo.name,
          sellerEmail: clientInfo.email,
          sellerPhone: clientInfo.phone,
          propertyAddress: clientInfo.address,
          notes: clientInfo.notes
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(4);
        // Interstitial then redirect
        setTimeout(() => {
          window.location.href = `https://rea-seller.vercel.app/?clientId=${data.sellerClientId}&token=${data.handoffToken}`;
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#004EA8] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-[#004EA8] text-white font-semibold py-3 rounded-xl hover:bg-[#003d82] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex flex-col items-start">
            <div className="relative w-48 h-16 mb-2">
              <Image 
                src={logoUrl}
                alt="World Class Title Logo"
                fill
                className="object-contain object-left"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#004EA8] uppercase font-nunito">
              Smart Onboarding
            </p>
          </div>
          <div className="flex gap-3">
            {invoiceId && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider border border-emerald-200">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
              </span>
            )}
            {agent?.verificationStatus === 'verified' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wider border border-blue-200">
                <ShieldCheck className="h-3 w-3 mr-1" /> Verified
              </span>
            )}
          </div>
        </div>

        <Stepper currentStep={step} />

        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 font-nunito uppercase tracking-[0.15em]">
                    {invoiceId ? 'Payment received' : 'Welcome to Smart'}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 font-nunito">
                    {invoiceId 
                      ? 'Next step, verify your identity to unlock Smart Spaces and begin client authorization.'
                      : 'Verify your identity to unlock Smart Spaces and begin client authorization.'}
                  </p>

                  <div className="space-y-6 mb-10">
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex gap-4">
                        <ShieldCheck className="h-6 w-6 text-[#004EA8] shrink-0" />
                        <div>
                          <h4 className="font-bold text-[#004EA8] mb-1 font-montserrat uppercase tracking-wider text-xs">What is Smart Verification?</h4>
                          <p className="text-sm text-blue-800 leading-relaxed font-nunito">
                            Smart Verification is our secure identity layer. By verifying who you are, we establish a chain of trust that allows you to handle sensitive property data and legal authorizations on behalf of your clients without traditional paperwork delays.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                      <div className="flex gap-4">
                        <UserPlus className="h-6 w-6 text-indigo-600 shrink-0" />
                        <div>
                          <h4 className="font-bold text-indigo-600 mb-1 font-montserrat uppercase tracking-wider text-xs">Why Onboard the Homeowner?</h4>
                          <p className="text-sm text-indigo-800 leading-relaxed font-nunito">
                            Onboarding your client (the homeowner) early allows us to proactively collect prior title policies and secure digital authorizations. This &quot;Smart&quot; approach identifies title issues weeks before the closing date, ensuring a smooth, surprise-free experience for your client.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={startVerification}
                      disabled={verifying}
                      className="w-full bg-[#004EA8] text-white font-bold py-4 rounded-2xl hover:bg-[#003d82] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify my identity
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => sendVerificationLink(agent.email)}
                        className="flex-1 bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email me a link
                      </button>
                      <button
                        onClick={() => setShowLinkModal(true)}
                        className="flex-1 bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Smartphone className="h-4 w-4" />
                        Send to phone
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Invoice: <span className="font-mono font-bold text-gray-700">{invoiceId}</span></span>
                  <span className="text-gray-900 font-bold">${invoice?.amount.toFixed(2)} {invoice?.currency.toUpperCase()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900">Identity Verified</h3>
                    <p className="text-sm text-emerald-700">Your Smart Spaces dashboard is now ready.</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/spaces')}
                  className="text-emerald-700 font-bold text-sm hover:underline flex items-center gap-1"
                >
                  Go to dashboard <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-nunito uppercase tracking-[0.15em]">Homeowner details</h2>
                <p className="text-gray-600 mb-8 font-nunito">Provide homeowner information for proactive authorization and prior policy collection.</p>

                <form onSubmit={submitSellerClient} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Homeowner Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all font-nunito"
                        value={clientInfo.name}
                        onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Homeowner Email</label>
                      <input
                        required
                        type="email"
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all font-nunito"
                        value={clientInfo.email}
                        onChange={e => setClientInfo({ ...clientInfo, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Homeowner Mobile Phone</label>
                      <input
                        required
                        type="tel"
                        placeholder="(555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all font-nunito"
                        value={clientInfo.phone}
                        onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Property Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          required
                          type="text"
                          placeholder="123 Main St, City, State"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all font-nunito"
                          value={clientInfo.address}
                          onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Optional Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Any specific instructions for the title team..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all resize-none font-nunito"
                      value={clientInfo.notes}
                      onChange={e => setClientInfo({ ...clientInfo, notes: e.target.value })}
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#004EA8] text-white font-bold py-4 rounded-2xl hover:bg-[#003d82] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue to homeowner flow'}
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-8 py-4 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center"
            >
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="h-10 w-10 text-[#004EA8] animate-spin" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-nunito uppercase tracking-[0.15em]">Preparing handoff</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto font-nunito">
                We&apos;re securely routing you to the homeowner authorization flow. You&apos;ll be redirected in just a moment.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#004EA8] uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" /> Secure Connection Established
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Verification Link Modal (Prototype) */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">Verification link sent</h3>
            <p className="text-gray-600 mb-6">
              We&apos;ve generated a secure, one-time link for you to complete verification on another device.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 break-all">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Prototype Link</p>
              <a href={linkSent || '#'} target="_blank" className="text-[#004EA8] font-mono text-sm hover:underline">
                {linkSent || 'Generating...'}
              </a>
            </div>

            <button 
              onClick={() => setShowLinkModal(false)}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Mock Verification Popup */}
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-12 max-w-lg w-full shadow-2xl text-center border border-blue-50"
          >
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="h-12 w-12 text-[#004EA8]" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-nunito uppercase tracking-[0.15em]">Authentication Here</h3>
            <p className="text-lg text-gray-600 mb-10 font-nunito leading-relaxed">
              This is where the secure identity verification process would take place. For this prototype, simply click next to proceed.
            </p>
            
            <button 
              onClick={completeVerification}
              className="w-full bg-[#004EA8] text-white font-bold py-5 rounded-2xl hover:bg-[#003d82] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 text-lg uppercase tracking-wider"
            >
              Next
              <ArrowRight className="h-6 w-6" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
