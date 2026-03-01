import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ApplicationData } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

export const MedicalStep: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<ApplicationData>();

  // For Medical History Array
  const { fields: historyFields, append: appendHistory, remove: removeHistory } = useFieldArray({
    control,
    name: "medical.history"
  });

  // For Existing Insurance Array
  const { fields: insuranceFields, append: appendInsurance, remove: removeInsurance } = useFieldArray({
    control,
    name: "medical.existingInsurance"
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Existing Insurance */}
      <div className="border-b pb-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Existing Insurance (其他保单信息)</h2>
            <button
                type="button"
                onClick={() => appendInsurance({ company: '', amount: 0, startYear: '' })}
                className="text-sm border border-brand-500 text-brand-500 px-3 py-1 rounded hover:bg-brand-50 flex items-center"
            >
                <Plus size={16} className="mr-1"/> Add Policy
            </button>
        </div>
        {insuranceFields.length === 0 && <p className="text-gray-400 italic text-sm">No other existing insurance listed.</p>}
        <div className="space-y-3">
             {insuranceFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end bg-gray-50 p-3 rounded">
                     <div className="md:col-span-5">
                        <label className="text-xs text-gray-500">Company</label>
                        <input {...register(`medical.existingInsurance.${index}.company`)} className="w-full border p-1 rounded" />
                     </div>
                     <div className="md:col-span-3">
                        <label className="text-xs text-gray-500">Amount</label>
                        <input type="number" {...register(`medical.existingInsurance.${index}.amount`, {valueAsNumber: true})} className="w-full border p-1 rounded" />
                     </div>
                     <div className="md:col-span-3">
                        <label className="text-xs text-gray-500">Start Year</label>
                        <input {...register(`medical.existingInsurance.${index}.startYear`)} className="w-full border p-1 rounded" />
                     </div>
                     <div className="md:col-span-1 text-right">
                        <button type="button" onClick={() => removeInsurance(index)} className="text-red-500"><Trash2 size={16}/></button>
                     </div>
                </div>
             ))}
        </div>
      </div>

      {/* Vitals */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Medical Information (健康信息)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Height (cm/ft)</label>
                <input
                    {...register('medical.height')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                />
                 {errors.medical?.height && <p className="text-red-500 text-xs mt-1">{errors.medical.height.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg/lbs)</label>
                <input
                    {...register('medical.weight')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                />
                 {errors.medical?.weight && <p className="text-red-500 text-xs mt-1">{errors.medical.weight.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Weight Change (1 yr)</label>
                <input
                    {...register('medical.weightChange')}
                    placeholder="e.g. +5kg"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                />
            </div>
        </div>
      </div>

      {/* Provider Info */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h3 className="font-semibold text-green-800 mb-3">Primary Care Provider (家庭医生)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
                <input {...register('medical.doctorName')} className="w-full border p-2 rounded" />
                 {errors.medical?.doctorName && <p className="text-red-500 text-xs mt-1">{errors.medical.doctorName.message}</p>}
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea {...register('medical.doctorAddress')} rows={2} className="w-full border p-2 rounded" />
                 {errors.medical?.doctorAddress && <p className="text-red-500 text-xs mt-1">{errors.medical.doctorAddress.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Last Consult Date</label>
                <input type="date" {...register('medical.lastConsultDate')} className="w-full border p-2 rounded" />
                 {errors.medical?.lastConsultDate && <p className="text-red-500 text-xs mt-1">{errors.medical.lastConsultDate.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Reason for Visit</label>
                <input {...register('medical.lastConsultReason')} className="w-full border p-2 rounded" />
                 {errors.medical?.lastConsultReason && <p className="text-red-500 text-xs mt-1">{errors.medical.lastConsultReason.message}</p>}
            </div>
        </div>
      </div>

      {/* Specific History */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Medical History (疾病历史)</h3>
             <button
                type="button"
                onClick={() => appendHistory({ year: '', condition: '', treatment: '' })}
                className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 flex items-center"
            >
                <Plus size={16} className="mr-1"/> Add Condition
            </button>
        </div>
        
        {historyFields.length === 0 && <p className="text-gray-400 italic text-sm">No specific conditions added. Click 'Add Condition' if applicable.</p>}

        <div className="space-y-4">
            {historyFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg relative bg-white shadow-sm">
                     <button 
                        type="button" 
                        onClick={() => removeHistory(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                    >
                        <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label className="text-xs font-bold text-gray-500">Year</label>
                             <input {...register(`medical.history.${index}.year`)} className="w-full border p-2 rounded bg-gray-50" />
                        </div>
                        <div>
                             <label className="text-xs font-bold text-gray-500">Condition/Reason</label>
                             <input {...register(`medical.history.${index}.condition`)} className="w-full border p-2 rounded bg-gray-50" />
                        </div>
                        <div className="md:col-span-2">
                             <label className="text-xs font-bold text-gray-500">Treatments/Meds/Follow-up</label>
                             <textarea {...register(`medical.history.${index}.treatment`)} rows={2} className="w-full border p-2 rounded bg-gray-50" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};