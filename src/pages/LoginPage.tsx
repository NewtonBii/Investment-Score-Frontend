import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Mail, Lock, ArrowRight} from 'lucide-react';
import {Button} from '../components/ui/Button';
import {Input} from '../components/ui/Input';
import {useAuth} from '../context/AuthContext';

interface LoginPageProps {
    onNavigate: (page: string) => void;
}

export function LoginPage({onNavigate}: LoginPageProps) {
    const {login} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiError, setApiError] = useState('');
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});
    const validate = () => {
        const newErrors: {
            email?: string;
            password?: string;
        } = {};
        if (!email) newErrors.email = 'Email is required'; else if (!/\S+@\S+\.\S+/.test(email))
            newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password is required';
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
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            if (response.ok) {
                const data = await response.json().catch(() => null);
                if (!data || !data.token) throw new Error('Invalid server response');

                login(data.token, data.user);
                onNavigate('dashboard');
            } else {
                let errMsg = 'Invalid email or password';
                try {
                    const errData = await response.json();
                    errMsg = errData.detail || errData.message || errMsg;
                } catch {
                    // ignore json parse error
                }
                setApiError(errMsg);
            }
        } catch (err: any) {
            console.warn('Login failed or backend unavailable:', err.message);
            setApiError('Error login in');
        } finally {
            setIsLoading(false); // ✅ always stop loading
        }
    };
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"/>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"/>
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
                    <div
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-teal-800 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,212,170,0.3)]">
            <span className="font-mono font-bold text-background text-2xl">
              I
            </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">
                        Sign in to access your investment score
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-2xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            label="Email Address"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            icon={<Mail className="w-5 h-5"/>}/>


                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.password}
                                icon={<Lock className="w-5 h-5"/>}/>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-xs text-primary hover:text-primary/80 transition-colors">

                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            icon={<ArrowRight className="w-4 h-4"/>}>

                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <button
                                onClick={() => onNavigate('register')}
                                className="text-primary font-medium hover:text-primary/80 transition-colors">

                                Create account
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>);

}