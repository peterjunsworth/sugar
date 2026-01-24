'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { ArrowLeft, ArrowRight, UserCircle } from 'lucide-react';

interface FormData {
  age: string;
  weight: string;
  diabetesType: string;
  targetMin: string;
  targetMax: string;
}

export default function SetupStep1Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    diabetesType: '',
    targetMin: '70',
    targetMax: '180',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Save data and navigate to step 2
    localStorage.setItem('setupStep1Data', JSON.stringify(formData));
    router.push('/setup/step-2');
  };

  const handleBack = () => {
    router.push('/welcome');
  };

  return (
    <div className="wizard-container">
      {/* Header */}
      <div className="wizard-header">
        <button onClick={handleBack} className="back-btn" type="button">
          <ArrowLeft size={20} />
        </button>
        <a href="/welcome" className="skip-btn">Skip</a>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className="step-dot active"></div>
        <div className="step-dot"></div>
        <div className="step-dot"></div>
      </div>

      {/* Content */}
      <div className="wizard-content">
        <div className="wizard-icon">
          <UserCircle size={40} strokeWidth={1.5} color="white" />
        </div>

        <h1 className="wizard-title">Tell Us About You</h1>
        <p className="wizard-description">
          Help us personalize your experience by sharing a few basic details.
        </p>

        <form className="wizard-form" id="wizardForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter your age"
              min="1"
              max="120"
              required
              name="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter your weight"
              min="1"
              step="0.1"
              required
              name="weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Diabetes Type</label>
            <select
              className="form-select"
              required
              name="diabetesType"
              value={formData.diabetesType}
              onChange={(e) => setFormData({ ...formData, diabetesType: e.target.value })}
            >
              <option value="">Select type</option>
              <option value="type1">Type 1 Diabetes</option>
              <option value="type2">Type 2 Diabetes</option>
              <option value="prediabetes">Prediabetes</option>
              <option value="gestational">Gestational Diabetes</option>
              <option value="other">Other / Not Sure</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Glucose Range (mg/dL)</label>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <input
                type="number"
                className="form-input"
                placeholder="Min (e.g., 70)"
                min="40"
                max="300"
                required
                name="targetMin"
                value={formData.targetMin}
                onChange={(e) => setFormData({ ...formData, targetMin: e.target.value })}
              />
              <input
                type="number"
                className="form-input"
                placeholder="Max (e.g., 180)"
                min="40"
                max="400"
                required
                name="targetMax"
                value={formData.targetMax}
                onChange={(e) => setFormData({ ...formData, targetMax: e.target.value })}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="wizard-footer">
        <div className="footer-buttons">
          <button onClick={handleBack} className="btn-secondary" type="button">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button type="submit" form="wizardForm" className="btn-primary">
            <span>Continue</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
