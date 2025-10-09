import { useState } from 'react';

type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseNewsletterSubscriptionReturn {
  email: string;
  setEmail: (email: string) => void;
  status: SubscriptionStatus;
  errorMessage: string | null;
  handleSubmit: (e: React.FormEvent, source?: string) => Promise<void>;
}

export function useNewsletterSubscription(): UseNewsletterSubscriptionReturn {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, source: string = 'unknown') => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const apiUrl = `${supabaseUrl}/functions/v1/subscribe-to-newsletter`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          source: source,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setEmail('');
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe. Please try again.');
        setTimeout(() => {
          setStatus('idle');
          setErrorMessage(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 5000);
    }
  };

  return {
    email,
    setEmail,
    status,
    errorMessage,
    handleSubmit,
  };
}
