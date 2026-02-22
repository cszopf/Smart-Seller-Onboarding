'use client';

import { Check, Circle, CreditCard, UserCheck, UserPlus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface StepperProps {
  currentStep: number;
}

export function Stepper({ currentStep }: StepperProps) {
  const steps: Step[] = [
    { id: 1, name: 'Payment confirmed', status: currentStep > 1 ? 'complete' : currentStep === 1 ? 'current' : 'upcoming' },
    { id: 2, name: 'Verify identity', status: currentStep > 2 ? 'complete' : currentStep === 2 ? 'current' : 'upcoming' },
    { id: 3, name: 'Add client details', status: currentStep > 3 ? 'complete' : currentStep === 3 ? 'current' : 'upcoming' },
    { id: 4, name: 'Continue to flow', status: currentStep > 4 ? 'complete' : currentStep === 4 ? 'current' : 'upcoming' },
  ];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center justify-between w-full">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn(stepIdx !== steps.length - 1 ? 'flex-1' : '', 'relative')}>
            <div className="flex items-center group">
              <span className="flex items-center text-sm font-medium">
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200',
                    step.status === 'complete' ? 'bg-[#004EA8] border-[#004EA8]' : 
                    step.status === 'current' ? 'border-[#004EA8] text-[#004EA8]' : 
                    'border-gray-300 text-gray-500'
                  )}
                >
                  {step.status === 'complete' ? (
                    <Check className="h-6 w-6 text-white" aria-hidden="true" />
                  ) : (
                    <span className={cn(step.status === 'current' ? 'text-[#004EA8]' : 'text-gray-500')}>
                      {step.id}
                    </span>
                  )}
                </span>
                <span className={cn(
                  "ml-4 text-xs font-semibold uppercase tracking-wide hidden md:block",
                  step.status === 'current' ? 'text-[#004EA8]' : 'text-gray-500'
                )}>
                  {step.name}
                </span>
              </span>
              {stepIdx !== steps.length - 1 && (
                <div className="ml-4 h-0.5 w-full bg-gray-200 group-last:hidden" />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
