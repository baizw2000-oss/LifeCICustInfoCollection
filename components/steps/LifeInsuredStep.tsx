import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ApplicationData } from '../../types';

export const LifeInsuredStep: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationData>();
  const isImmigrant = watch('lifeInsured.isImmigrant');

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Part 1: Life Insured (受保人)</h2>
      
      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name (全名)</label>
          <input
            {...register('lifeInsured.fullName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            placeholder="John Doe"
          />
          {errors.lifeInsured?.fullName && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth (生日)</label>
          <input
            type="date"
            {...register('lifeInsured.dob')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
          />
          {errors.lifeInsured?.dob && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.dob.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone (电话)</label>
          <input
            {...register('lifeInsured.phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
          />
          {errors.lifeInsured?.phone && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email (邮件)</label>
          <input
            type="email"
            {...register('lifeInsured.email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
          />
          {errors.lifeInsured?.email && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.email.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address (地址)</label>
          <textarea
            {...register('lifeInsured.address')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
          />
          {errors.lifeInsured?.address && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.address.message}</p>}
        </div>
      </div>

      {/* Status */}
      <div className="bg-blue-50 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-brand-800">Canadian Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Canadian Citizen? (公民)</label>
            <select
              {...register('lifeInsured.isCanadianCitizen')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.lifeInsured?.isCanadianCitizen && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.isCanadianCitizen.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Immigrant? (移民)</label>
            <select
              {...register('lifeInsured.isImmigrant')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.lifeInsured?.isImmigrant && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.isImmigrant.message}</p>}
          </div>

          {isImmigrant === 'yes' && (
            <div className="md:col-span-2 animate-fade-in-down">
               <label className="block text-sm font-medium text-gray-700">Landing Date (移民年月日)</label>
               <input
                type="date"
                {...register('lifeInsured.landingDate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
              />
              {errors.lifeInsured?.landingDate && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.landingDate.message}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Employment */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Employment Information (工作信息)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700">Employer Name (工作单位)</label>
            <input
              {...register('lifeInsured.employerName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            />
            {errors.lifeInsured?.employerName && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.employerName.message}</p>}
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Job Title (职业)</label>
            <input
              {...register('lifeInsured.jobTitle')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            />
            {errors.lifeInsured?.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.jobTitle.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Work Address (工作地址)</label>
            <input
              {...register('lifeInsured.employerAddress')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2"
            />
             {errors.lifeInsured?.employerAddress && <p className="text-red-500 text-xs mt-1">{errors.lifeInsured.employerAddress.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};