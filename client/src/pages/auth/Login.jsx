import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'admin@pindhe-sms.com',
    password: 'admin123',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await api.post('/auth/login', formData);
      if (res.data?.success && res.data.token && res.data.data) {
        login(res.data.data, res.data.token);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        setErrorMessage(
          res.data?.message ||
          'The server returned an unexpected response. Make sure the API server is running, then try again.'
        );
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        (err.response
          ? 'Unable to sign in. Check your details and try again.'
          : 'Cannot reach the server. Make sure the API server is running, then try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Enter your school account details to continue."
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-field-label" htmlFor="login-email">Email address</label>
          <div className="auth-input-wrap">
            <Mail className="auth-input-icon" aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              className="auth-input"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrorMessage('');
              }}
              placeholder="name@school.com"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <div className="auth-field-label-row">
            <label className="auth-field-label" htmlFor="login-password">Password</label>
            <Link className="auth-link" to="/forgot-password">Forgot password?</Link>
          </div>
          <div className="auth-input-wrap">
            <LockKeyhole className="auth-input-icon" aria-hidden="true" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input auth-input--password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrorMessage('');
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </div>
        </div>

        <label className="auth-remember-row" htmlFor="remember-me">
          <input
            id="remember-me"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            className="auth-checkbox"
          />
          <span>Remember me</span>
        </label>

        {errorMessage && (
          <div className="auth-inline-error" role="alert">
            <AlertCircle aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="auth-submit">
          {loading
            ? <><Loader2 className="animate-spin" aria-hidden="true" /> Signing in...</>
            : <>Sign in <ArrowRight aria-hidden="true" /></>}
        </button>
      </form>

      <details className="auth-demo">
        <summary>Demo account credentials</summary>
        <ul className="auth-demo-list">
          <li><span>Admin:</span> admin@pindhe-sms.com / admin123</li>
          <li><span>Teacher:</span> teacher@pindhe-sms.com / teacher123</li>
          <li><span>Parent:</span> parent@pindhe-sms.com / parent123</li>
          <li><span>Student:</span> student@pindhe-sms.com / student123</li>
        </ul>
      </details>

      <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">
        Need access? Contact your school administrator.
      </p>
    </AuthLayout>
  );
};

export default Login;