import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Loader2, CheckCircle2, ArrowLeft, RefreshCw, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

const OTP_LENGTH = 6;

export function OtpVerification() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }, [otp]);

  const sendOtp = async () => {
    setIsSending(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-verification', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setIsVerifying(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setVerified(true);
      setTimeout(() => setLocation('/'), 2500);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (otp.every(d => d !== '') && !isVerifying && !verified) {
      verifyOtp();
    }
  }, [otp]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card rounded-[2.5rem] border-primary/10 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-br from-primary/20 via-purple-600/20 to-indigo-600/20 p-8 text-center">
            <AnimatePresence mode="wait">
              {verified ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="shield"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4 relative">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <h2 className="text-2xl font-black tracking-tight">
              {verified ? 'Email Verified!' : 'Verify Your Email'}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {verified
                ? 'Redirecting to your dashboard...'
                : user?.email
                  ? `We'll send a code to ${user.email}`
                  : 'Enter the 6-digit code sent to your email'
              }
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            <AnimatePresence mode="wait">
              {verified ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.5, ease: 'easeInOut' }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {/* Send OTP Button */}
                  {!sent && (
                    <Button
                      onClick={sendOtp}
                      disabled={isSending}
                      className="w-full rounded-2xl h-14 text-base font-bold gap-3 shadow-xl shadow-primary/20"
                    >
                      {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Mail className="h-5 w-5" />
                      )}
                      {isSending ? 'Sending...' : 'Send Verification Code'}
                    </Button>
                  )}

                  {/* OTP Input Grid */}
                  {sent && (
                    <>
                      <div className="flex justify-center gap-3">
                        {otp.map((digit, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Input
                              ref={el => { inputRefs.current[index] = el; }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={e => handleChange(index, e.target.value)}
                              onKeyDown={e => handleKeyDown(index, e)}
                              onPaste={index === 0 ? handlePaste : undefined}
                              disabled={isVerifying}
                              className={`
                                w-12 h-14 text-center text-2xl font-black rounded-xl
                                border-2 transition-all duration-200
                                focus:border-primary focus:ring-2 focus:ring-primary/20
                                ${digit ? 'border-primary/50 bg-primary/5' : 'border-border'}
                                ${error ? 'border-red-500/50 shake' : ''}
                              `}
                              id={`otp-input-${index}`}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Verify Button */}
                      <Button
                        onClick={verifyOtp}
                        disabled={isVerifying || otp.some(d => d === '')}
                        className="w-full rounded-2xl h-12 font-bold gap-2 shadow-lg shadow-primary/20"
                      >
                        {isVerifying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                        {isVerifying ? 'Verifying...' : 'Verify Code'}
                      </Button>

                      {/* Resend */}
                      <div className="text-center">
                        <button
                          onClick={sendOtp}
                          disabled={isSending}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${isSending ? 'animate-spin' : ''}`} />
                          Resend code
                        </button>
                      </div>
                    </>
                  )}

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-red-400 text-center font-medium bg-red-500/10 rounded-xl px-4 py-3"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to Dashboard */}
            {!verified && (
              <button
                onClick={() => setLocation('/')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
