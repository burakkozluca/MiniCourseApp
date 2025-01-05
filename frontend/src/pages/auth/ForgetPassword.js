import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import alertify from 'alertifyjs';
import './ForgetPassword.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      console.log('Forgot password response:', response);
      
      if (response.status === 200 || response.status === 204) {
        alertify.success('Password reset link has been sent to your email');
        navigate('/login', { 
          state: { successMessage: 'Please check your email for password reset instructions' }
        });
      } else {
        alertify.error(response.data?.message || 'Failed to send reset link');
      }
    } catch (err) {
      if (err.response?.status === 200 || err.response?.status === 204) {
        alertify.success('Password reset link has been sent to your email');
        navigate('/login', { 
          state: { successMessage: 'Please check your email for password reset instructions' }
        });
        return;
      }
      
      console.error('Forgot password error:', err);
      alertify.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-box">
        <h2>Reset Password</h2>
        <p className="text-muted mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword; 