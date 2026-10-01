'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) { setError('fill'); return; }
    if (password !== confirm) { setError('mismatch'); return; }
    if (password.length < 8) { setError('short'); return; }
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
          <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Create account</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Start building your prompt library</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" error={error === 'short' ? 'Password must be at least 8 characters' : undefined} />
          <Input label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" error={error === 'mismatch' ? 'Passwords do not match' : undefined} />
          <Button type="submit" className="w-full" size="lg">Create Account</Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
