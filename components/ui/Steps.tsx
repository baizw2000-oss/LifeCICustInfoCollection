import React from 'react';
import { Check } from 'lucide-react';

interface StepsProps {
  currentStep: number;
  steps: string[];
}

export const Steps: React.FC<StepsProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded"></div>
        <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-brand-500 -z-10 rounded transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors duration-200
                  ${isCompleted ? 'bg-brand-500 border-brand-500 text-white' : 
                    isCurrent ? 'bg-white border-brand-600 text-brand-600' : 
                    'bg-white border-gray-300 text-gray-400'}
                `}
              >
                {isCompleted ? <Check size={20} /> : index + 1}
              </div>
              <span className={`mt-2 text-xs font-medium hidden sm:block ${isCurrent ? 'text-brand-700' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
      <div className="sm:hidden text-center mt-4 font-bold text-brand-700">
        {steps[currentStep]}
      </div>
    </div>
  );
};