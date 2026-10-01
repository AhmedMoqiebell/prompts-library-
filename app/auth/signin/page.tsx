'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Mock auth — store session and redirect
    sessionStorage.setItem('pv_auth', 'true');
    router.push('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Welcome back</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Sign in to PromptVault</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" error={error && !email ? 'Email is required' : undefined} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" error={error && !password ? 'Password is required' : undefined} />

          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">Forgot password?</Link>
          </div>

          <Button type="submit" className="w-full" size="lg">Sign In</Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
