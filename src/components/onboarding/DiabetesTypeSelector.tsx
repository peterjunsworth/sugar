'use client';

import { useWizard } from './WizardContext';
import { Activity, Heart, TrendingUp, Baby, Check } from 'lucide-react';

interface DiabetesTypeSelectorProps {
  error?: string;
}

type DiabetesType = 'type1' | 'type2' | 'prediabetes' | 'gestational';

interface DiabetesTypeOption {
  value: DiabetesType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const diabetesTypes: DiabetesTypeOption[] = [
  {
    value: 'type1',
    label: 'Type 1 Diabetes',
    description: 'Body does not produce insulin',
    icon: Activity,
  },
  {
    value: 'type2',
    label: 'Type 2 Diabetes',
    description: 'Body does not use insulin properly',
    icon: Heart,
  },
  {
    value: 'prediabetes',
    label: 'Prediabetes',
    description: 'Blood sugar higher than normal',
    icon: TrendingUp,
  },
  {
    value: 'gestational',
    label: 'Gestational Diabetes',
    description: 'Diabetes during pregnancy',
    icon: Baby,
  },
];

export default function DiabetesTypeSelector({ error }: DiabetesTypeSelectorProps) {
  const { wizardData, updateWizardData } = useWizard();

  const handleSelect = (type: DiabetesType) => {
    updateWizardData({ diabetesType: type });
  };

  return (
    <div className="space-y-3">
      <label
        className="block text-sm font-semibold"
        style={{ color: 'var(--foreground)' }}
      >
        Diabetes Type
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {diabetesTypes.map((type) => {
          const isSelected = wizardData.diabetesType === type.value;
          const Icon = type.icon;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => handleSelect(type.value)}
              data-testid={`diabetes-type-${type.value}`}
              className="relative p-4 rounded-lg transition-all text-left outline-none"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: isSelected ? 'var(--primary)' : 'var(--surface-border)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-hover)',
                    color: isSelected ? 'var(--primary-foreground)' : 'var(--foreground)',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-semibold text-sm mb-1"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {type.label}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {type.description}
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm mt-2" style={{ color: 'var(--destructive)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
