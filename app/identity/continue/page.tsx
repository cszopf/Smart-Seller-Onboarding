'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

function IdentityContinueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('t');
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  const verifyToken = async () => {
    // In a real app, we'd call an API to validate the token and set a session
    // For the prototype, we'll just simulate success
    setTimeout(() => {
      setStatus('success');
      // Redirect to the success page with the context (mocked)
      // In reality, the token would resolve to an invoiceId and sessionId
      router.push('/invoice/success?invoiceId=inv_123&sessionId=cs_test_123');
    }, 2000);
  };

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-[#004EA8] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Resuming verification</h2>
            <p className="text-gray-600">Please wait while we validate your secure link...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or expired link</h2>
            <p className="text-gray-600 mb-8">This verification link is no longer valid. Please request a new one from the payment success screen.</p>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-[#004EA8] text-white font-bold py-3 rounded-xl"
            >
              Return Home
            </button>
          </>
        )}

        {status === 'success' && (
          <>
            <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Link verified</h2>
            <p className="text-gray-600">Redirecting you to complete your onboarding...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function IdentityContinuePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IdentityContinueContent />
    </Suspense>
  );
}
