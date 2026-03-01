import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ApplicationSchema, 
  ApplicationData, 
  AppStep 
} from './types';
import { LifeInsuredStep } from './components/steps/LifeInsuredStep';
import { OwnerStep } from './components/steps/OwnerStep';
import { BeneficiaryFinancialStep } from './components/steps/BeneficiaryFinancialStep';
import { MedicalStep } from './components/steps/MedicalStep';
import { Steps } from './components/ui/Steps';
import { submitApplication, uploadFile } from './services/supabase';
import { ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Loader2, AlertCircle, FileText } from 'lucide-react';

const STEPS = [
  "Life Insured",
  "Policy Owner",
  "Assets & Beneficiaries",
  "Medical Info",
  "Review"
];

function App() {
  const [currentStep, setCurrentStep] = useState<number>(AppStep.LIFE_INSURED);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const methods = useForm<ApplicationData>({
    resolver: zodResolver(ApplicationSchema),
    mode: 'onChange',
    defaultValues: {
        financials: { beneficiaries: [{name: '', percentage: 100, isMinor: false}], totalAssets: 0, totalLiabilities: 0 },
        medical: { history: [], existingInsurance: [] }
    }
  });

  const { trigger, handleSubmit, getValues } = methods;

  const nextStep = async () => {
    let isValid = false;
    
    // Validate only current step fields
    if (currentStep === AppStep.LIFE_INSURED) {
      isValid = await trigger('lifeInsured');
    } else if (currentStep === AppStep.OWNER) {
      isValid = await trigger('owner');
    } else if (currentStep === AppStep.FINANCIALS) {
      isValid = await trigger('financials');
    } else if (currentStep === AppStep.MEDICAL) {
      isValid = await trigger('medical');
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: ApplicationData) => {
    try {
        setIsSubmitting(true);
        setSubmitError(null);
        
        // 1. Upload Driver's License if exists (handled safely internally)
        let licenseUrl = null;
        if (fileToUpload) {
            licenseUrl = await uploadFile(fileToUpload, 'licenses');
        }
    
        // 2. Submit Data
        const result = await submitApplication(data, licenseUrl);
        
        setIsSubmitting(false);
        
        if (result.success) {
            setReferenceId(result.referenceId || "N/A");
            setSubmitSuccess(true);
            window.scrollTo(0, 0);
        } else {
            // Show the actual error message from Supabase/Network
            let errorMessage = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
            setSubmitError(errorMessage);
        }
    } catch (criticalError: any) {
        console.error("Critical submission error:", criticalError);
        setIsSubmitting(false);
        setSubmitError("Application crashed during submission. Please try again or contact support.");
    }
  };

  // Success Screen
  if (submitSuccess) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border-t-4 border-green-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h1>
                
                <div className="bg-gray-100 p-3 rounded-lg my-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reference ID</span>
                    <span className="font-mono text-lg font-bold text-gray-800">{referenceId}</span>
                </div>

                <p className="text-gray-600 mb-6 text-sm">
                    We have received your life insurance application. An email confirmation has been sent to the agent.
                </p>
                
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 transition-colors font-semibold flex justify-center items-center"
                >
                    <FileText size={18} className="mr-2"/> Start New Application
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Life Insurance Application</h1>
            <p className="mt-2 text-gray-600">Secure • Standardized • Fast</p>
        </div>

        {/* Wizard Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Progress */}
            <div className="bg-gray-50 px-6 sm:px-10 border-b border-gray-100">
                <Steps currentStep={currentStep} steps={STEPS} />
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-10">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        
                        {currentStep === AppStep.LIFE_INSURED && <LifeInsuredStep />}
                        
                        {currentStep === AppStep.OWNER && (
                            <OwnerStep 
                                onFileUpload={setFileToUpload} 
                                fileName={fileToUpload?.name} 
                            />
                        )}
                        
                        {currentStep === AppStep.FINANCIALS && <BeneficiaryFinancialStep />}
                        
                        {currentStep === AppStep.MEDICAL && <MedicalStep />}

                        {/* Review Step */}
                        {currentStep === AppStep.REVIEW && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start">
                                    <AlertTriangle className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-bold">Confirmation Required</p>
                                        <p>Please review your information carefully before submitting. By clicking Submit, you agree that the information provided is accurate to the best of your knowledge.</p>
                                    </div>
                                </div>
                                
                                <div className="text-sm text-gray-600 space-y-2 border-l-4 border-gray-200 pl-4 py-2">
                                    <p><strong>Applicant:</strong> {getValues('lifeInsured.fullName')}</p>
                                    <p><strong>Owner:</strong> {getValues('owner.fullName')}</p>
                                    <p><strong>Beneficiaries:</strong> {getValues('financials.beneficiaries')?.length} listed</p>
                                    <p><strong>Net Worth:</strong> ${getValues('financials.netWorth')?.toLocaleString()}</p>
                                </div>

                                {submitError && (
                                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start text-red-700 animate-pulse">
                                        <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={18} />
                                        <div className="text-sm">
                                            <p className="font-bold">Submission Failed</p>
                                            <p>{submitError}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-8 pt-6 border-t flex justify-between">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 0 || isSubmitting}
                                className={`flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors
                                    ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
                                `}
                            >
                                <ChevronLeft size={18} className="mr-1" /> Back
                            </button>

                            {currentStep === AppStep.REVIEW ? (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center px-8 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-md transition-all disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={18} /> Processing...
                                        </>
                                    ) : (
                                        <>Submit Application <CheckCircle size={18} className="ml-2" /></>
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center px-8 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-md transition-all"
                                >
                                    Next Step <ChevronRight size={18} className="ml-2" />
                                </button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;