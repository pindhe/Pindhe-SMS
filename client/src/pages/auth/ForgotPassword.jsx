import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await api.post('/auth/forgotpassword', { email });
      if (res.data?.success) {
        setSent(true);
        toast.success('Reset link sent to your email');
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
          ? 'Failed to send the reset link. Please try again.'
          : 'Cannot reach the server. Make sure the API server is running, then try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={sent ? 'Request received' : 'Account recovery'}
      title={sent ? 'Check your inbox' : 'Forgot your password?'}
      description={sent
        ? 'If this address is registered, password reset instructions will be sent there.'
        : 'Enter the email address linked to your school account and we’ll help you get back in.'}
    >
      {sent ? (
        <div className="auth-success" role="status" aria-live="polite">
          <div className="auth-success-icon">
            <CheckCircle2 aria-hidden="true" />
          </div>
          <h2>Reset request received</h2>
          <p>
            Your request was submitted for <strong>{email}</strong>. Please check
            that inbox for the next steps.
          </p>
          <Link className="auth-submit" to="/login">
            <ArrowLeft aria-hidden="true" /> Back to login
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="recovery-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail className="auth-input-icon" aria-hidden="true" />
                <input
                  id="recovery-email"
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="name@school.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="auth-inline-error" role="alert">
                <AlertCircle aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-submit">
              {loading
                ? <><Loader2 className="animate-spin" aria-hidden="true" /> Sending...</>
                : <>Send reset link <Mail aria-hidden="true" /></>}
            </button>
          </form>

          <Link className="auth-back-link" to="/login">
            <ArrowLeft aria-hidden="true" /> Back to login
          </Link>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;