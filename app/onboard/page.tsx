'use client';

export const dynamic = "force-dynamic";

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
  FileText,
  Plus,
  Trash2,
  Users,
  Upload,
  FileSearch,
  Sparkles,
  X
} from 'lucide-react';
import { Stepper } from '@/components/Stepper';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('invoiceId');
  const sessionId = searchParams.get('sessionId');
  const logoUrl = "https://lh7-rt.googleusercontent.com/docsz/AD_4nXeSb6s_P3nXRrs9OUquQgATijkDX14cEdeK7kfFUFKVOvUMVife1HmNbLBMS4EQ8b5nKM-enx639-uc6mZ1b9kQbj41a6g4HwvAQPWZVHqq7Ity6k9n7AMSqCQVe-TAnBOOSaJcAhUrAuLw6bnSVj9pQYPDIw?key=kl0MF71HcvaAWt9zvK_MLQ";
  const headshotUrl = "https://lh7-rt.googleusercontent.com/docsz/AD_4nXe6Tb9_rjAZXJBDcY-fBLjF8XZn3Bn0oPyVdKgW1C-uXIAornHsxant93RXuSqKpn9n2ID1nMkXU3fClBfbDbslzdfoq3sEMopFyibq-__ibq4MoOGtHRku0tjKeKvYeqyoKfkNAoxHdHr8s_KbEJl-O8Yq_Bo?key=kl0MF71HcvaAWt9zvK_MLQ";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [agent, setAgent] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [linkSent, setLinkSent] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showHandoffPopup, setShowHandoffPopup] = useState(false);
  const [agentQuestion, setAgentQuestion] = useState('');

  // Form states for client info
  const [homeowners, setHomeowners] = useState([{ name: '', email: '', phone: '' }]);
  const [propertyAddress, setPropertyAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [teamMembers, setTeamMembers] = useState<{ role: string, name: string, email: string }[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{ id: string, name: string, type: string, summary?: string, status: 'uploading' | 'scanning' | 'ready' | 'confirmed' }[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      status: 'uploading' as const
    }));

    setUploadedDocs(prev => [...prev, ...newDocs]);

    // Process each file
    for (const doc of newDocs) {
      // 1. Simulate Upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadedDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'scanning' as const } : d));

      // 2. AI Scan with Gemini via Server Route
      try {
        const prompt = `You are a title insurance expert. Create a brief, professional 3-bullet point summary for a document named "${doc.name}". 
          Assume it is a real estate document like a title policy, survey, or deed. 
          Make the summary sound realistic and helpful for a title team. 
          Format: Just the 3 bullet points, no intro.`;

        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to scan document");
        }

        const summary = data.result || "AI could not generate a summary for this document.";
        setUploadedDocs(prev => prev.map(d => d.id === doc.id ? { ...d, summary, status: 'ready' as const } : d));
      } catch (err) {
        console.error("AI Scanning failed:", err);
        setUploadedDocs(prev => prev.map(d => d.id === doc.id ? { ...d, summary: "Error scanning document. Please review manually.", status: 'ready' as const } : d));
      }
    }
  };

  const confirmDoc = (id: string) => {
    setUploadedDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'confirmed' as const } : d));
  };

  const removeDoc = (id: string) => {
    setUploadedDocs(prev => prev.filter(d => d.id !== id));
  };

  const addHomeowner = () => {
    setHomeowners([...homeowners, { name: '', email: '', phone: '' }]);
  };

  const removeHomeowner = (index: number) => {
    if (homeowners.length > 1) {
      setHomeowners(homeowners.filter((_, i) => i !== index));
    }
  };

  const updateHomeowner = (index: number, field: string, value: string) => {
    const newHomeowners = [...homeowners];
    newHomeowners[index] = { ...newHomeowners[index], [field]: value };
    setHomeowners(newHomeowners);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { role: 'Transaction Coordinator', name: '', email: '' }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
    setTeamMembers(newTeamMembers);
  };

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
        setPropertyAddress('123 Listing Lane, Beverly Hills, CA');
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
    setShowHandoffPopup(true);
  };

  const confirmHandoff = async () => {
    try {
      setShowHandoffPopup(false);
      setLoading(true);
      const res = await fetch('/api/seller-clients/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId,
          agentUserId: agent.agentUserId,
          sellerName: homeowners[0].name,
          sellerEmail: homeowners[0].email,
          sellerPhone: homeowners[0].phone,
          propertyAddress,
          notes,
          additionalHomeowners: homeowners.slice(1),
          teamMembers,
          agentQuestion // Pass the question if any
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
                  <div className="flex items-center gap-6 mb-8">
                    {invoiceId && (
                      <div className="relative flex shrink-0">
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20,
                            delay: 0.2 
                          }}
                          className="bg-emerald-500 p-3 rounded-full shadow-lg shadow-emerald-200 relative z-10"
                        >
                          <CheckCircle2 className="h-8 w-8 text-white" />
                        </motion.div>
                        
                        {/* Confetti particles */}
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{ 
                              scale: [0, 1, 0],
                              x: (Math.random() - 0.5) * 150,
                              y: (Math.random() - 0.5) * 150,
                              rotate: Math.random() * 360
                            }}
                            transition={{ 
                              duration: 1.5,
                              delay: 0.3,
                              ease: "easeOut"
                            }}
                            className={cn(
                              "absolute w-1.5 h-1.5 rounded-sm",
                              i % 3 === 0 ? "bg-emerald-400" : i % 3 === 1 ? "bg-blue-400" : "bg-yellow-400"
                            )}
                            style={{ left: '50%', top: '50%' }}
                          />
                        ))}
                      </div>
                    )}

                    <h2 className="text-3xl font-bold text-gray-900 font-nunito uppercase tracking-[0.15em]">
                      {invoiceId ? 'Payment received' : 'Welcome to Smart'}
                    </h2>
                  </div>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-nunito uppercase tracking-[0.15em]">Add details</h2>
                <p className="text-gray-600 mb-8 font-nunito">Provide homeowner and team information for proactive authorization and prior policy collection.</p>

                <form onSubmit={submitSellerClient} className="space-y-10">
                  {/* Property Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-[#004EA8] uppercase tracking-[0.2em] flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Property Information
                    </h3>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Property Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          required
                          type="text"
                          placeholder="123 Main St, City, State"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all font-nunito"
                          value={propertyAddress}
                          onChange={e => setPropertyAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Homeowners Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#004EA8] uppercase tracking-[0.2em] flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Homeowner Details
                      </h3>
                      <button
                        type="button"
                        onClick={addHomeowner}
                        className="text-[#004EA8] text-xs font-bold flex items-center gap-1 hover:underline"
                      >
                        <Plus className="h-3 w-3" /> Additional homeowner
                      </button>
                    </div>

                    <div className="space-y-8">
                      {homeowners.map((homeowner, index) => (
                        <div key={index} className="relative p-6 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-6">
                          {homeowners.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHomeowner(index)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Full Name</label>
                              <input
                                required
                                type="text"
                                placeholder="Jane Doe"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all font-nunito bg-white"
                                value={homeowner.name}
                                onChange={e => updateHomeowner(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Email</label>
                              <input
                                required
                                type="email"
                                placeholder="jane@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all font-nunito bg-white"
                                value={homeowner.email}
                                onChange={e => updateHomeowner(index, 'email', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Mobile Phone</label>
                              <input
                                required
                                type="tel"
                                placeholder="(555) 000-0000"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all font-nunito bg-white"
                                value={homeowner.phone}
                                onChange={e => updateHomeowner(index, 'phone', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Members Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#004EA8] uppercase tracking-[0.2em] flex items-center gap-2">
                        <Users className="h-4 w-4" /> Team Members
                      </h3>
                      <button
                        type="button"
                        onClick={addTeamMember}
                        className="text-[#004EA8] text-xs font-bold flex items-center gap-1 hover:underline"
                      >
                        <Plus className="h-3 w-3" /> Add team members
                      </button>
                    </div>

                    {teamMembers.length > 0 ? (
                      <div className="space-y-4">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-gray-100 bg-white items-end">
                            <div className="flex-1 space-y-2 w-full">
                              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Role</label>
                              <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] outline-none transition-all font-nunito bg-white"
                                value={member.role}
                                onChange={e => updateTeamMember(index, 'role', e.target.value)}
                              >
                                <option>Transaction Coordinator</option>
                                <option>Agent (Team Member)</option>
                                <option>Assistant</option>
                              </select>
                            </div>
                            <div className="flex-1 space-y-2 w-full">
                              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Full Name</label>
                              <input
                                required
                                type="text"
                                placeholder="John Smith"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] outline-none transition-all font-nunito bg-white"
                                value={member.name}
                                onChange={e => updateTeamMember(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="flex-1 space-y-2 w-full">
                              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Email</label>
                              <input
                                required
                                type="email"
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] outline-none transition-all font-nunito bg-white"
                                value={member.email}
                                onChange={e => updateTeamMember(index, 'email', e.target.value)}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                        <p className="text-sm text-gray-400 font-nunito">No team members added yet. Add a TC or assistant to keep them in the loop.</p>
                      </div>
                    )}
                  </div>

                  {/* Supporting Documents Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-[#004EA8] uppercase tracking-[0.2em] flex items-center gap-2">
                      <FileSearch className="h-4 w-4" /> Supporting Documents
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="relative group">
                        <input 
                          type="file" 
                          multiple 
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center group-hover:border-[#004EA8] group-hover:bg-blue-50/50 transition-all">
                          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6 text-[#004EA8]" />
                          </div>
                          <p className="text-sm font-bold text-gray-700 mb-1">Click or drag to upload documents</p>
                          <p className="text-xs text-gray-400">Prior Title Policies, Surveys, Trust Agreements, etc.</p>
                        </div>
                      </div>

                      {uploadedDocs.length > 0 && (
                        <div className="space-y-4">
                          {uploadedDocs.map((doc) => (
                            <motion.div 
                              key={doc.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                            >
                              <div className="p-4 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                  <div className="bg-white p-2 rounded-lg border border-gray-100">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                      {doc.status === 'uploading' ? 'Uploading...' : doc.status === 'scanning' ? 'AI Scanning...' : 'Scan Complete'}
                                    </p>
                                  </div>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => removeDoc(doc.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>

                              {(doc.status === 'scanning' || doc.status === 'ready' || doc.status === 'confirmed') && (
                                <div className="p-6 space-y-4">
                                  <div className="flex items-center gap-2 text-[#004EA8]">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] font-montserrat">AI Summary</span>
                                  </div>
                                  
                                  {doc.status === 'scanning' ? (
                                    <div className="flex items-center gap-3 py-2">
                                      <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                      <p className="text-sm text-gray-400 italic">Analyzing document contents...</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-blue-50/30 p-4 rounded-xl border border-blue-50/50">
                                        {doc.summary}
                                      </div>
                                      
                                      {doc.status === 'ready' ? (
                                        <button
                                          type="button"
                                          onClick={() => confirmDoc(doc.id)}
                                          className="text-xs font-bold text-[#004EA8] flex items-center gap-1 hover:underline"
                                        >
                                          <CheckCircle2 className="h-3 w-3" /> Confirm AI Summary
                                        </button>
                                      ) : (
                                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                                          <CheckCircle2 className="h-3 w-3" /> Summary Confirmed
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Optional Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Any specific instructions for the title team..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] focus:border-transparent outline-none transition-all resize-none font-nunito"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
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

      {/* Handoff Confirmation Popup */}
      {showHandoffPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl border border-blue-50 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-nunito uppercase tracking-[0.1em]">Ready for Handoff?</h3>
                <p className="text-gray-500 font-nunito">Review what your homeowner will experience next.</p>
              </div>
              <button onClick={() => setShowHandoffPopup(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-[#004EA8] mb-3 uppercase tracking-wider text-xs flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> Homeowner Experience
                  </h4>
                  <ul className="space-y-3 text-sm text-blue-900 font-nunito">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
                      <span>Instant SMS/Email with secure link</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
                      <span>Digital authorization for title search</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
                      <span>Secure upload for prior title policy</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-700 mb-3 uppercase tracking-wider text-xs flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Why it matters
                  </h4>
                  <p className="text-sm text-emerald-800 leading-relaxed font-nunito">
                    Proactive onboarding identifies title issues 2-3 weeks earlier than traditional methods, ensuring your closing stays on track.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                      <Image src={headshotUrl} alt="Chris Sauerzopf" width={48} height={48} className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Chris Sauerzopf</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">WCT Sales Rep</p>
                      <p className="text-[#004EA8] text-[10px] font-bold mt-0.5">Have a question, reach out.</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600 font-medium">
                    <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> chris@worldclasstitle.com</p>
                    <p className="flex items-center gap-2"><Smartphone className="h-3 w-3" /> 614.444.4444</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] font-montserrat">Question for Chris?</label>
                  <textarea 
                    rows={3}
                    placeholder="Ask anything before we send..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004EA8] outline-none transition-all text-sm resize-none"
                    value={agentQuestion}
                    onChange={(e) => setAgentQuestion(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={confirmHandoff}
              className="w-full bg-[#004EA8] text-white font-bold py-5 rounded-2xl hover:bg-[#003d82] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 text-lg uppercase tracking-wider"
            >
              Confirm & Send to Homeowner
              <ArrowRight className="h-6 w-6" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
