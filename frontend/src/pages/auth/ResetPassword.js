import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../../services/userService';
import alertify from 'alertifyjs';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  // URL'den email ve token'ı al
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alertify.error('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      alertify.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // ResetPassword API'sini çağır
      const response = await userService.resetPassword({
        email: email,
        token: token,
        newPassword: passwords.newPassword
      });
      console.log("response",response);
      if (response.status === 200) {
        alertify.success('Password has been reset successfully');
        navigate('/login', {
          state: { successMessage: 'Your password has been reset. Please login with your new password.' }
        });
      } else {
        alertify.error(response.data?.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      alertify.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-box">
          <div className="alert alert-danger">
            Invalid password reset link. Please request a new one.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Your Password</h2>
        <p className="text-muted mb-4">
          Please enter your new password below.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              required
              minLength={6}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
              required
              minLength={6}
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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 