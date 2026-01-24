'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Activity, Zap, Edit, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type DeviceType = 'dexcom' | 'libre' | 'manual' | 'skip' | '';

interface Device {
  id: DeviceType;
  name: string;
  icon: any;
  description: string;
  iconColor: string;
}

export default function SetupStep2Page() {
  const router = useRouter();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('');
  const [step1Data, setStep1Data] = useState<any>(null);

  useEffect(() => {
    // Load Step 1 data
    const data = localStorage.getItem('setupStep1Data');
    if (data) {
      setStep1Data(JSON.parse(data));
    } else {
      // No step 1 data, redirect back
      router.push('/setup/step-1');
    }
  }, [router]);

  const devices: Device[] = [
    {
      id: 'dexcom',
      name: 'Dexcom CGM',
      icon: Activity,
      description: 'Continuous Glucose Monitor',
      iconColor: 'dexcom'
    },
    {
      id: 'libre',
      name: 'FreeStyle Libre',
      icon: Zap,
      description: 'Flash Glucose Monitor',
      iconColor: 'libre'
    },
    {
      id: 'manual',
      name: 'Manual Entry',
      icon: Edit,
      description: 'Enter readings yourself',
      iconColor: 'manual'
    },
    {
      id: 'skip',
      name: 'Set Up Later',
      icon: ArrowRight,
      description: "I'll configure this later",
      iconColor: 'skip'
    }
  ];

  const handleContinue = () => {
    if (!selectedDevice) {
      alert('Please select a device option');
      return;
    }

    // Save step 2 data
    const step2Data = { device: selectedDevice };
    localStorage.setItem('setupStep2Data', JSON.stringify(step2Data));

    // If skip or manual, go directly to step 3 (final summary)
    router.push('/setup/step-3');
  };

  const handleSkip = () => {
    // Save "manual" as default
    const step2Data = { device: 'manual' };
    localStorage.setItem('setupStep2Data', JSON.stringify(step2Data));
    router.push('/setup/step-3');
  };

  if (!step1Data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wizard-container">
      {/* Header */}
      <div className="wizard-header">
        <Link href="/setup/step-1" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
        <button onClick={handleSkip} className="skip-btn" type="button">
          Skip
        </button>
      </div>

      {/* Progress Dots */}
      <div className="progress-steps">
        <div className="step-dot completed"></div>
        <div className="step-dot active"></div>
        <div className="step-dot"></div>
      </div>

      {/* Content */}
      <div className="wizard-content">
        {/* Icon */}
        <div className="wizard-icon">
          <Activity size={40} strokeWidth={1.5} color="white" />
        </div>

        {/* Title */}
        <h1 className="wizard-title">Choose Your Device</h1>
        <p className="wizard-description">
          Select how you'd like to track your glucose levels. You can change this later.
        </p>

        {/* Device Cards */}
        <div className="device-grid">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <div
                key={device.id}
                className={`device-card ${selectedDevice === device.id ? 'selected' : ''}`}
                onClick={() => setSelectedDevice(device.id)}
              >
                <div className={`device-icon-wrapper ${device.iconColor}`}>
                  <Icon size={24} color="white" />
                </div>
                <div className="device-content">
                  <div className="device-name">{device.name}</div>
                  <div className="device-description">{device.description}</div>
                </div>
                <div className="device-check">
                  {selectedDevice === device.id && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="wizard-footer">
        <div className="footer-buttons">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.push('/setup/step-1')}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleContinue}
            disabled={!selectedDevice}
          >
            <span>Continue</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
