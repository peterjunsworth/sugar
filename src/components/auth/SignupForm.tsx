'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  api?: string;
}

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear API error
    setErrors((prev) => {
      const { api, ...rest } = prev;
      return rest;
    });

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({ api: error.error || 'Registration failed' });
        return;
      }

      const data = await response.json();

      console.log('[SignupForm] Registration response:', data);

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('[SignupForm] Token saved to localStorage:', data.token.substring(0, 20) + '...');
      } else {
        console.warn('[SignupForm] No token in response');
      }

      // Registration successful, redirect to onboarding
      // Use window.location for full page reload to ensure cookie is sent with request
      console.log('[SignupForm] Redirecting to /setup/step-1');
      window.location.href = '/setup/step-1';
    } catch (error) {
      setErrors({ api: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const { [field as keyof FormErrors]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="signup-form" className="space-y-5">
      {/* API Error Message */}
      {errors.api && (
        <div
          className="p-4 rounded-lg text-sm"
          style={{
            backgroundColor: 'var(--destructive)',
            color: 'var(--destructive-foreground)',
          }}
        >
          {errors.api}
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          Full Name
        </label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
            className="w-full pl-11 pr-4 py-3 rounded-lg border outline-none transition-all"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: errors.name ? 'var(--destructive)' : 'var(--surface-border)',
              color: 'var(--foreground)',
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </div>
        {errors.name && (
          <p id="name-error" className="text-sm" style={{ color: 'var(--destructive)' }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          Email
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            className="w-full pl-11 pr-4 py-3 rounded-lg border outline-none transition-all"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: errors.email ? 'var(--destructive)' : 'var(--surface-border)',
              color: 'var(--foreground)',
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-sm" style={{ color: 'var(--destructive)' }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••••"
            className="w-full pl-11 pr-12 py-3 rounded-lg border outline-none transition-all"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: errors.password ? 'var(--destructive)' : 'var(--surface-border)',
              color: 'var(--foreground)',
            }}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            data-testid="password-toggle"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm" style={{ color: 'var(--destructive)' }}>
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            className="w-full pl-11 pr-12 py-3 rounded-lg border outline-none transition-all"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: errors.confirmPassword
                ? 'var(--destructive)'
                : 'var(--surface-border)',
              color: 'var(--foreground)',
            }}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            data-testid="confirm-password-toggle"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            className="text-sm"
            style={{ color: 'var(--destructive)' }}
          >
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={(e) => handleChange('terms', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 cursor-pointer"
            style={{
              borderColor: errors.terms ? 'var(--destructive)' : 'var(--surface-border)',
            }}
            aria-invalid={!!errors.terms}
            aria-describedby={errors.terms ? 'terms-error' : undefined}
          />
          <label
            htmlFor="terms"
            className="text-sm cursor-pointer"
            style={{ color: 'var(--muted-foreground)' }}
          >
            I agree to the{' '}
            <a
              href="/terms"
              className="font-semibold hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="font-semibold hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p id="terms-error" className="text-sm" style={{ color: 'var(--destructive)' }}>
            {errors.terms}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
        }}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}
