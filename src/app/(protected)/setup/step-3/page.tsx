'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SetupStep3Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<any>(null);
  const [step2Data, setStep2Data] = useState<any>(null);

  useEffect(() => {
    // Load previous steps data
    const data1 = localStorage.getItem('setupStep1Data');
    const data2 = localStorage.getItem('setupStep2Data');

    if (data1) setStep1Data(JSON.parse(data1));
    if (data2) setStep2Data(JSON.parse(data2));

    if (!data1 || !data2) {
      // Missing data, redirect to step 1
      router.push('/setup/step-1');
    }
  }, [router]);

  const getDiabetesTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      type1: 'Type 1 Diabetes',
      type2: 'Type 2 Diabetes',
      prediabetes: 'Prediabetes',
      gestational: 'Gestational Diabetes',
      other: 'Other / Not Sure'
    };
    return labels[type] || type;
  };

  const getDeviceLabel = (device: string) => {
    const labels: Record<string, string> = {
      dexcom: 'Dexcom CGM',
      libre: 'FreeStyle Libre',
      manual: 'Manual Entry',
      skip: 'Set Up Later'
    };
    return labels[device] || device;
  };

  const handleComplete = async () => {
    if (!step1Data || !step2Data) return;

    setLoading(true);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call setup API
      const response = await fetch('/api/user/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          age: step1Data.age,
          weight: step1Data.weight,
          diabetesType: step1Data.diabetesType,
          glucoseMin: step1Data.targetMin,
          glucoseMax: step1Data.targetMax,
          device: step2Data.device,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Setup failed');
      }

      // Clear wizard data
      localStorage.removeItem('setupStep1Data');
      localStorage.removeItem('setupStep2Data');

      // Redirect to welcome
      router.push('/welcome');
    } catch (error) {
      console.error('Setup error:', error);
      alert(`Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!step1Data || !step2Data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wizard-container">
      {/* Header */}
      <div className="wizard-header">
        <Link href="/setup/step-2" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
        <div></div>
      </div>

      {/* Progress Dots */}
      <div className="progress-steps">
        <div className="step-dot completed"></div>
        <div className="step-dot completed"></div>
        <div className="step-dot active"></div>
      </div>

      {/* Content */}
      <div className="wizard-content">
        {/* Icon */}
        <div className="wizard-icon">
          <Check size={40} strokeWidth={1.5} color="white" />
        </div>

        {/* Title */}
        <h1 className="wizard-title">All Set!</h1>
        <p className="wizard-description">
          You're ready to start tracking your health
        </p>

        {/* Summary */}
        <div className="setup-summary">
          <div className="summary-item">
            <span className="summary-label">Age:</span>
            <span className="summary-value">{step1Data.age} years</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Weight:</span>
            <span className="summary-value">{step1Data.weight} kg</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Diabetes Type:</span>
            <span className="summary-value">{getDiabetesTypeLabel(step1Data.diabetesType)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Target Range:</span>
            <span className="summary-value">{step1Data.targetMin}-{step1Data.targetMax} mg/dL</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Device:</span>
            <span className="summary-value">{getDeviceLabel(step2Data.device)}</span>
          </div>
        </div>

        <p className="setup-note">
          Note: This is a simplified setup. Full device connection and permissions configuration will be available in your profile settings.
        </p>
      </div>

      {/* Footer */}
      <div className="wizard-footer">
        <div className="footer-buttons">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.push('/setup/step-2')}
            disabled={loading}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleComplete}
            disabled={loading}
          >
            <span>{loading ? 'Completing...' : 'Complete Setup'}</span>
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
