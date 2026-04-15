import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VerifyEmail() {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        if (res.ok) {
          setStatus('success');
          setMessage('Email verified successfully! Welcome to the premium tier.');
        } else {
          const data = await res.json();
          setStatus('error');
          setMessage(data.message || 'Verification failed. The link may have expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('A network error occurred. Please try again later.');
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-10 text-center space-y-8 rounded-[3rem] border-primary/20 shadow-2xl shadow-primary/5"
      >
        <div className="flex justify-center">
          {status === 'loading' && (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Loader2 className="h-16 w-16 text-primary opacity-50" />
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
              <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
              <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gradient tracking-tight">
            {status === 'loading' ? 'Just a second' : status === 'success' ? 'Verification Success' : 'Verification Failed'}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full rounded-2xl h-12 text-lg font-bold group"
            onClick={() => setLocation('/dashboard')}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
