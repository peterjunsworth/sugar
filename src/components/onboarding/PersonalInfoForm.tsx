'use client';

import { useWizard } from './WizardContext';

interface PersonalInfoFormProps {
  errors?: Record<string, string>;
}

export default function PersonalInfoForm({ errors = {} }: PersonalInfoFormProps) {
  const { wizardData, updateWizardData } = useWizard();

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateWizardData({ age: value ? parseInt(value, 10) : undefined });
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateWizardData({ weight: value ? parseFloat(value) : undefined });
  };

  const handleUnitToggle = (unit: 'lbs' | 'kg') => {
    if (wizardData.weightUnit === unit) return;

    // Convert weight if exists
    let newWeight = wizardData.weight;
    if (newWeight) {
      if (unit === 'kg') {
        // lbs to kg
        newWeight = Math.round((newWeight / 2.20462) * 10) / 10;
      } else {
        // kg to lbs
        newWeight = Math.round((newWeight * 2.20462) * 10) / 10;
      }
    }

    updateWizardData({ weightUnit: unit, weight: newWeight });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="age"
          className="block text-sm font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          min="1"
          max="120"
          value={wizardData.age || ''}
          onChange={handleAgeChange}
          placeholder="Enter your age"
          className="w-full px-4 py-3 rounded-lg transition-all outline-none"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: errors.age ? 'var(--destructive)' : 'var(--surface-border)',
            color: 'var(--foreground)',
          }}
        />
        {errors.age && (
          <p className="text-sm mt-1" style={{ color: 'var(--destructive)' }}>
            {errors.age}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="weight"
          className="block text-sm font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          Weight
        </label>
        <div className="flex gap-2">
          <input
            id="weight"
            name="weight"
            type="number"
            min="1"
            step="0.1"
            value={wizardData.weight || ''}
            onChange={handleWeightChange}
            placeholder={`Enter weight in ${wizardData.weightUnit}`}
            className="flex-1 px-4 py-3 rounded-lg transition-all outline-none"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: errors.weight ? 'var(--destructive)' : 'var(--surface-border)',
              color: 'var(--foreground)',
            }}
          />
          <div
            className="flex rounded-lg overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--surface-border)',
            }}
          >
            <button
              type="button"
              onClick={() => handleUnitToggle('lbs')}
              className="px-4 py-3 font-medium text-sm transition-all"
              style={{
                backgroundColor: wizardData.weightUnit === 'lbs' ? 'var(--primary)' : 'transparent',
                color: wizardData.weightUnit === 'lbs' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              }}
            >
              lbs
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('kg')}
              className="px-4 py-3 font-medium text-sm transition-all"
              style={{
                backgroundColor: wizardData.weightUnit === 'kg' ? 'var(--primary)' : 'transparent',
                color: wizardData.weightUnit === 'kg' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              }}
            >
              kg
            </button>
          </div>
        </div>
        {errors.weight && (
          <p className="text-sm mt-1" style={{ color: 'var(--destructive)' }}>
            {errors.weight}
          </p>
        )}
      </div>
    </div>
  );
}
