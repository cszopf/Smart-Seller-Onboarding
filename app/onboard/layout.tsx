'use client';

import { Suspense } from 'react';
import InvoiceSuccessPage from './page';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#004EA8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <InvoiceSuccessPage />
    </Suspense>
  );
}
