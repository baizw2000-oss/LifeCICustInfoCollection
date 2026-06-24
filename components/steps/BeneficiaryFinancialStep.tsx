import React, { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ApplicationData } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

export const BeneficiaryFinancialStep: React.FC = () => {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<ApplicationData>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "financials.beneficiaries"
  });

  const watchedAssets = watch('financials.totalAssets');
  const watchedLiabilities = watch('financials.totalLiabilities');

  const assets = watchedAssets !== undefined && watchedAssets !== null && !isNaN(Number(watchedAssets)) ? Number(watchedAssets) : 0;
  const liabilities = watchedLiabilities !== undefined && watchedLiabilities !== null && !isNaN(Number(watchedLiabilities)) ? Number(watchedLiabilities) : 0;
  const netWorth = assets - liabilities;

  useEffect(() => {
    setValue('financials.netWorth', netWorth, { shouldValidate: true, shouldDirty: true });
  }, [netWorth, setValue]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Beneficiaries */}
      <div>
        <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Beneficiaries (受益人信息)</h2>
            <button
                type="button"
                onClick={() => append({ name: '', percentage: 100, isMinor: false })}
                className="text-sm bg-brand-500 text-white px-3 py-1 rounded hover:bg-brand-600 flex items-center"
            >
                <Plus size={16} className="mr-1"/> Add
            </button>
        </div>
        
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                    <button 
                        type="button" 
                        onClick={() => remove(index)}
                        className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                    >
                        <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5">
                            <label className="block text-xs font-medium text-gray-500">Full Name</label>
                            <input
                                {...register(`financials.beneficiaries.${index}.name`)}
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                                placeholder="Beneficiary Name"
                            />
                             {errors.financials?.beneficiaries?.[index]?.name && <p className="text-red-500 text-xs">{errors.financials.beneficiaries[index]?.name?.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-xs font-medium text-gray-500">Share %</label>
                             <input
                                type="number"
                                {...register(`financials.beneficiaries.${index}.percentage`, { valueAsNumber: true })}
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                            />
                        </div>
                        <div className="md:col-span-5">
                             <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    {...register(`financials.beneficiaries.${index}.isMinor`)}
                                    className="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Under 18? (Is Minor)</label>
                             </div>
                        </div>
                         {/* Conditional Trustee Input */}
                        <div className="md:col-span-12">
                             <label className="block text-xs font-medium text-gray-500">Trustee Name (If minor)</label>
                             <input
                                {...register(`financials.beneficiaries.${index}.trusteeName`)}
                                placeholder="Mandatory if beneficiary < 18"
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                            />
                        </div>
                    </div>
                </div>
            ))}
             {errors.financials?.beneficiaries && <p className="text-red-500 text-sm mt-1">{errors.financials.beneficiaries.message}</p>}
        </div>
      </div>

      {/* Financials */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Financial Information (财务信息)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Earned Income</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            {...register('financials.annualIncome', { valueAsNumber: true })}
                            className="block w-full rounded-md border-gray-300 pl-7 focus:border-brand-500 focus:ring-brand-500 border p-2"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Other Income</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            {...register('financials.otherIncome', { valueAsNumber: true })}
                            className="block w-full rounded-md border-gray-300 pl-7 focus:border-brand-500 focus:ring-brand-500 border p-2"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Net Worth Calculation (资产净值)</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Assets (Cash, Real Estate, Stocks)</label>
                    <input
                        type="number"
                        {...register('financials.totalAssets', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Liabilities (Mortgages, Loans)</label>
                    <input
                        type="number"
                        {...register('financials.totalLiabilities', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                    />
                </div>
                <div className="border-t pt-2 mt-2">
                    <label className="block text-sm font-bold text-gray-900">Estimated Net Worth</label>
                    <div className="text-2xl font-bold text-brand-600">
                        ${netWorth.toLocaleString()}
                    </div>
                    {/* Hidden input to sync netWorth value */}
                    <input type="hidden" {...register('financials.netWorth')} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};