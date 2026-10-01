'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">
            {sent ? 'Check your email' : 'Reset password'}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {sent ? `We sent a reset link to ${email}` : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {sent ? (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 text-center">
            <CheckCircle className="w-12 h-12 text-[var(--color-success)] mx-auto mb-4" />
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              If an account with that email exists, you&apos;ll receive a password reset link.
            </p>
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <Button type="submit" className="w-full" size="lg" disabled={!email.trim()}>Send Reset Link</Button>
          </form>
        )}

        {!sent && (
          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">
            <Link href="/auth/signin" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
