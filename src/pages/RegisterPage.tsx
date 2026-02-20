import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
interface RegisterPageProps {
  onNavigate: (page: string) => void;
}
export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';else
    if (!/\S+@\S+\.\S+/.test(formData.email))
    newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';else
    if (formData.password.length < 8)
    newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      const API_BASE = 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      if (response.ok) {
        const data = await response.json();
        register(data.access_token, data.user);
        onNavigate('upload');
      } else {
        const err = await response.json().catch(() => ({}));
        setApiError(
          err.detail || err.message || 'Registration failed. Please try again.'
        );
      }
    } catch (err) {
      // Backend not available — use mock register for development
      console.warn('Backend unavailable, using mock register');
      register('mock-token-' + Date.now(), {
        id: String(Date.now()),
        email: formData.email,
        name: formData.name,
        created_at: new Date().toISOString()
      });
      onNavigate('upload');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-teal-800 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,212,170,0.3)]">
            <span className="font-mono font-bold text-background text-2xl">
              I
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">
            Start your investment readiness journey
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {apiError &&
            <motion.div
              initial={{
                opacity: 0,
                y: -8
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="bg-danger/10 border border-danger/30 text-danger text-sm px-4 py-3 rounded-lg">

                {apiError}
              </motion.div>
            }

            <Input
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
              })
              }
              error={errors.name}
              icon={<User className="w-5 h-5" />} />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value
              })
              }
              error={errors.email}
              icon={<Mail className="w-5 h-5" />} />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value
              })
              }
              error={errors.password}
              icon={<Lock className="w-5 h-5" />} />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
              setFormData({
                ...formData,
                confirmPassword: e.target.value
              })
              }
              error={errors.confirmPassword}
              icon={<Lock className="w-5 h-5" />} />


            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}>

              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-primary font-medium hover:text-primary/80 transition-colors">

                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>);

}