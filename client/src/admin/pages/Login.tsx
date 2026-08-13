import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, ShieldCheck, Sparkles, Building2, Palmtree } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('akashvalluvady@gmail.com');
  const [password, setPassword] = useState('8606778603');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setLoading(true);
    setError(null);
    try {
      await login(quickEmail, quickPass);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-white font-bold text-2xl shadow-xl">
            L
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">Lexur Green CMS Admin Portal</h1>
          <p className="text-xs text-slate-400">Sign in to manage Lexur Green Serviced Villa, Valluvady Wayanad.</p>
        </div>

        {/* Login Form Card */}
        <form onSubmit={handleSubmit} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-2xl">
          {error && (
            <div className="p-3 text-xs bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In to Lexur Green Admin'}
          </button>
        </form>

        {/* Quick Demo Login Shortcuts */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider text-center">1-Click Lexur Green Admin Login</p>
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('akashvalluvady@gmail.com', '8606778603')}
              className="w-full p-2.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 rounded-lg text-left text-xs flex items-center justify-between text-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Palmtree className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">Akash Valluvady (Lexur Green)</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">akashvalluvady@gmail.com</span>
            </button>

            <button
              onClick={() => handleQuickLogin('adarsh.m.sasi@gmail.com', 'lock@Jyothika5816')}
              className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left text-xs flex items-center justify-between text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold">Super Admin (Platform Owner)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">adarsh.m.sasi@gmail.com</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-200">
            ← Return to Public Website Demo
          </Link>
        </div>
      </div>
    </div>
  );
};
