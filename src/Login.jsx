import { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin-secret-portal');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("بيانات الدخول غير صحيحة!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6" dir="rtl">
      <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">دخول الإدارة</h2>
        <input 
          type="email" placeholder="البريد الإلكتروني" 
          className="w-full p-4 mb-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-yellow-500 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="كلمة المرور" 
          className="w-full p-4 mb-6 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-yellow-500 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all">
          دخول
        </button>
      </form>
    </div>
  );
}

export default Login;