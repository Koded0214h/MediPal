import axios from 'axios';
import '../styles/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/token/', {
        email,
        password,
      });

      const { access, refresh } = res.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      // Redirect user to dashboard or homepage
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <form onSubmit={handleLogin} className="">
      <div className='login'>
        <label className="input">Email</label>
        <input
          type="email"
          className="value"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

                  <i className="fa fa-user" aria-hidden="true"></i>

      </div>

      <div className='login'>
        <label className="input">Password</label>
        <input
  type={showPassword ? "text" : "password"}
          className="value"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required

        />

<span
          className="fas"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="submit"
      >
        <a href="/dashboard">
        Log In</a>
      </button>
      <div className="terms">
        <p>Forgot Password?</p>
      </div>
    </form>
  );
}