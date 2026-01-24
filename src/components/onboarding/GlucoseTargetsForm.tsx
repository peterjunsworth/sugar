'use client';

import { useWizard } from './WizardContext';

interface GlucoseTargetsFormProps {
  error?: string;
}

export default function GlucoseTargetsForm({ error }: GlucoseTargetsFormProps) {
  const { wizardData, updateWizardData } = useWizard();

  const handleLowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!wizardData.glucoseTargets) return;

    updateWizardData({
      glucoseTargets: {
        ...wizardData.glucoseTargets,
        low: value ? parseFloat(value) : 0,
      },
    });
  };

  const handleHighChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!wizardData.glucoseTargets) return;

    updateWizardData({
      glucoseTargets: {
        ...wizardData.glucoseTargets,
        high: value ? parseFloat(value) : 0,
      },
    });
  };

  const handleUnitToggle = (unit: 'mg/dL' | 'mmol/L') => {
    if (!wizardData.glucoseTargets) return;
    if (wizardData.glucoseTargets.unit === unit) return;

    let newLow = wizardData.glucoseTargets.low;
    let newHigh = wizardData.glucoseTargets.high;

    if (unit === 'mmol/L') {
      // mg/dL to mmol/L
      newLow = Math.round((newLow / 18) * 10) / 10;
      newHigh = Math.round((newHigh / 18) * 10) / 10;
    } else {
      // mmol/L to mg/dL
      newLow = Math.round(newLow * 18);
      newHigh = Math.round(newHigh * 18);
    }

    updateWizardData({
      glucoseTargets: {
        low: newLow,
        high: newHigh,
        unit,
      },
    });
  };

  const currentUnit = wizardData.glucoseTargets?.unit || 'mg/dL';
  const lowValue = wizardData.glucoseTargets?.low || '';
  const highValue = wizardData.glucoseTargets?.high || '';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          className="block text-sm font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          Target Glucose Range
        </label>

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
            onClick={() => handleUnitToggle('mg/dL')}
            className="px-3 py-1.5 font-medium text-xs transition-all"
            style={{
              backgroundColor: currentUnit === 'mg/dL' ? 'var(--primary)' : 'transparent',
              color: currentUnit === 'mg/dL' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
          >
            mg/dL
          </button>
          <button
            type="button"
            onClick={() => handleUnitToggle('mmol/L')}
            className="px-3 py-1.5 font-medium text-xs transition-all"
            style={{
              backgroundColor: currentUnit === 'mmol/L' ? 'var(--primary)' : 'transparent',
              color: currentUnit === 'mmol/L' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
          >
            mmol/L
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label
            htmlFor="glucose-low"
            className="block text-xs font-medium"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Target Low
          </label>
          <input
            id="glucose-low"
            name="glucose-low"
            type="number"
            min="1"
            step={currentUnit === 'mmol/L' ? '0.1' : '1'}
            value={lowValue}
            onChange={handleLowChange}
            placeholder={currentUnit === 'mg/dL' ? '70' : '4.0'}
            className="w-full px-4 py-3 rounded-lg transition-all outline-none"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: error ? 'var(--destructive)' : 'var(--surface-border)',
              color: 'var(--foreground)',
            }}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="glucose-high"
            className="block text-xs font-medium"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Target High
          </label>
          <input
            id="glucose-high"
            name="glucose-high"
            type="number"
            min="1"
            step={currentUnit === 'mmol/L' ? '0.1' : '1'}
            value={highValue}
            onChange={handleHighChange}
            placeholder={currentUnit === 'mg/dL' ? '180' : '10.0'}
            className="w-full px-4 py-3 rounded-lg transition-all outline-none"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: error ? 'var(--destructive)' : 'var(--surface-border)',
              color: 'var(--foreground)',
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm mt-2" style={{ color: 'var(--destructive)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
