import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  return (
    <div className="payment-success-container">
      <div className="success-card">
        <div className="success-icon">
          ✅
        </div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your transaction has been completed successfully.</p>
        <div className="success-actions">
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
          <Link to="/my-courses" className="btn btn-outline-primary">
            View My Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 