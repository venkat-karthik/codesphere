import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginInstructions } from './LoginInstructions';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthModalsProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export function AuthModals({ isOpen, mode, onClose, onSwitchMode }: AuthModalsProps) {
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      onClose();
      setLoginData({ email: '', password: '' });
    } else {
      setError(result.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await register({
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      password: registerData.password,
    });

    if (result.success) {
      onClose();
      setRegisterData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    } else {
      setError(result.message || 'Registration failed');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2">
      <div className="bg-cs-bg rounded-xl w-full max-w-lg border border-cs-sidebar shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-cs-body hover:text-cs-heading transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {mode === 'login' ? (
          <div className="p-10">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-cs-primary rounded-lg flex items-center justify-center mx-auto mb-2 shadow">
                <span className="text-white font-bold text-lg">CS</span>
              </div>
              <h2 className="text-xl font-bold mb-1 text-cs-heading">Sign In</h2>
              <p className="text-cs-body text-sm">Access your account</p>
            </div>

            {/* Collapsible Demo Accounts */}
            <details className="mb-4">
              <summary className="cursor-pointer text-cs-primary text-sm mb-2 select-none">
                ▸ Try Demo Accounts
              </summary>
              <div className="mt-2 rounded-lg p-2">
                <LoginInstructions onFill={(email, password) => setLoginData({ email, password })} />
              </div>
            </details>

            <form onSubmit={handleLogin} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="email" className="text-cs-body text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="Email"
                  required
                  className="bg-cs-sidebar border-cs-primary text-cs-heading placeholder-cs-body focus:ring-cs-primary text-sm py-2"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-cs-body text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Password"
                  required
                  className="bg-cs-sidebar border-cs-primary text-cs-heading placeholder-cs-body focus:ring-cs-primary text-sm py-2"
                />
              </div>
              {error && (
                <div className="text-red-400 text-xs">{error}</div>
              )}
              <Button type="submit" className="w-full bg-cs-primary hover:bg-cs-secondary text-white font-semibold py-2 rounded-md shadow transition-all duration-150 text-sm" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center mt-2">
              <button onClick={() => setShowForgot(true)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Forgot password?
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-cs-body text-xs">No account? </span>
              <button
                onClick={() => onSwitchMode('register')}
                className="text-cs-primary hover:text-cs-secondary font-medium transition-colors text-xs"
              >
                Sign up
              </button>
            </div>
          </div>
        ) : (          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold text-xl">CS</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Create Account</h2>
              <p className="text-muted-foreground">Join the CodeSphere community</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="registerEmail">Email</Label>
                <Input
                  id="registerEmail"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="registerPassword">Password</Label>
                <Input
                  id="registerPassword"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="Create a password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <span className="text-muted-foreground">Already have an account? </span>
              <button
                onClick={() => onSwitchMode('login')}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>

      <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  );
}
