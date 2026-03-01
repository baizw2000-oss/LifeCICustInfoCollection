import React, { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { ApplicationData } from '../../types';
import { Upload } from 'lucide-react';

interface OwnerStepProps {
  onFileUpload: (file: File) => void;
  fileName?: string;
}

export const OwnerStep: React.FC<OwnerStepProps> = ({ onFileUpload, fileName }) => {
  const { register, formState: { errors } } = useFormContext<ApplicationData>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Part 2: Policy Owner (保单持有人)</h2>
       <p className="text-sm text-gray-500">Often the parent or spouse (父母, 配偶等)</p>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Relationship to Life Insured (关系)</label>
            <input
              {...register('owner.relationToInsured')}
              placeholder="e.g. Spouse, Father, Self"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            />
             {errors.owner?.relationToInsured && <p className="text-red-500 text-xs mt-1">{errors.owner.relationToInsured.message}</p>}
         </div>

         <div>
          <label className="block text-sm font-medium text-gray-700">Full Name (全名)</label>
          <input
            {...register('owner.fullName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
          />
           {errors.owner?.fullName && <p className="text-red-500 text-xs mt-1">{errors.owner.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth (生日)</label>
          <input
            type="date"
            {...register('owner.dob')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
          />
           {errors.owner?.dob && <p className="text-red-500 text-xs mt-1">{errors.owner.dob.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SIN # (工卡号码)</label>
          <input
            {...register('owner.sin')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
          />
           {errors.owner?.sin && <p className="text-red-500 text-xs mt-1">{errors.owner.sin.message}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
                {...register('owner.phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            />
             {errors.owner?.phone && <p className="text-red-500 text-xs mt-1">{errors.owner.phone.message}</p>}
        </div>

        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                {...register('owner.email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            />
             {errors.owner?.email && <p className="text-red-500 text-xs mt-1">{errors.owner.email.message}</p>}
        </div>

        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address (地址)</label>
            <textarea
                {...register('owner.address')}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            />
             {errors.owner?.address && <p className="text-red-500 text-xs mt-1">{errors.owner.address.message}</p>}
        </div>
       </div>

       {/* ID Verification */}
       <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
         <h3 className="font-semibold text-yellow-800 mb-2">Identity Verification (Driver's License)</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">License Number (驾照号码)</label>
                <input
                    {...register('owner.driversLicenseNumber')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                />
                 {errors.owner?.driversLicenseNumber && <p className="text-red-500 text-xs mt-1">{errors.owner.driversLicenseNumber.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date (过期日期)</label>
                <input
                    type="date"
                    {...register('owner.driversLicenseExpiry')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
                />
                 {errors.owner?.driversLicenseExpiry && <p className="text-red-500 text-xs mt-1">{errors.owner.driversLicenseExpiry.message}</p>}
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo of License (驾照拍照)</label>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                            {fileName && <p className="text-sm text-brand-600 font-bold mt-2">Selected: {fileName}</p>}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
            </div>
         </div>
       </div>
    </div>
  );
};