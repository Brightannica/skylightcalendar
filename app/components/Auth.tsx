import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      onLogin(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl w-96 text-center border border-slate-200">
        <div className="flex justify-center mb-6 text-blue-600 bg-blue-50 w-20 h-20 rounded-full items-center mx-auto">
           <User size={40} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">
          {isLogin ? 'Welcome' : 'Join Us'}
        </h1>
        <p className="text-slate-400 font-medium mb-8">
           {isLogin ? 'Sign in to your calendar' : 'Create your account'}
        </p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-bold border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-400 transition-all"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-400 transition-all"
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-2 text-lg">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-sm text-slate-500 font-medium">
          {isLogin ? "New here? " : "Have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-extrabold hover:underline">
            {isLogin ? 'Create Account' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
