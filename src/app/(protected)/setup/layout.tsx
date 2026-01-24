import { WizardProvider } from '@/components/onboarding/WizardContext';
import { ReactNode } from 'react';

export default function SetupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <WizardProvider>{children}</WizardProvider>;
}
