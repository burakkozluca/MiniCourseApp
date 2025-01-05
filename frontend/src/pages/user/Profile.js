import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import alertify from 'alertifyjs';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getUser();
      if (response.data.isSuccess) {
        setUser(response.data.data);
        setUserId(response.data.data.id);
        setEditForm({
          firstName: response.data.data.firstName || '',
          lastName: response.data.data.lastName || '',
          email: response.data.data.email || '',
          dateOfBirth: response.data.data.dateOfBirth ? new Date(response.data.data.dateOfBirth).toISOString().split('T')[0] : '',
          phoneNumber: response.data.data.phoneNumber || ''
        });
      }
    } catch (err) {
      setError('Failed to fetch user profile');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating profile with:', editForm);
      const response = await userService.updateProfile(editForm);
      
      if (response.status === 200 || response.status === 204) {
        alertify.success('Profile updated successfully');
        setIsEditing(false);
        fetchUserProfile();
      } else {
        const errorMessage = response.data.errors || response.data.message || 'Failed to update profile';
        alertify.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      const errorMessage = err.response?.data?.errors || 
                          err.response?.data?.message || 
                          'Failed to update profile';
      alertify.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alertify.error('User ID not found');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alertify.error('New passwords do not match');
      return;
    }

    try {
      const request = {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        reNewPassword: passwordForm.confirmPassword,
        userId: userId
      };

      console.log('Sending password change request:', request);

      const response = await userService.changePassword(request);
      console.log('Password change response:', response);

      if (response.status === 200 || response.status === 204) {
        alertify.success('Password changed successfully');
        setShowPasswordForm(false);
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorMessage = response.data.errors || response.data.message || 'Failed to change password';
        alertify.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to change password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      const errorMessage = err.response?.data?.errors || 
                          err.response?.data?.message || 
                          'Failed to change password';
      alertify.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to change password');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;
  if (!user) return <div className="alert alert-info m-5">User not found</div>;

  return (
    <div className="profile-container container py-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card profile-sidebar">
            <div className="card-body">
              <div className="profile-header text-center mb-4">
                <div className="profile-avatar">
                  {user.userName?.charAt(0).toUpperCase()}
                </div>
                <h4 className="mt-3">{user.userName}</h4>
                <p className="text-muted">{user.email}</p>
              </div>
              <div className="profile-links">
                <Link to="/my-courses" className="btn btn-outline-primary w-100 mb-2">
                  My Courses
                </Link>
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title">Profile Information</h3>
                {!isEditing && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editForm.dateOfBirth}
                      onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="mb-3">
                    <label className="form-label text-muted">First Name</label>
                    <p className="form-control-static">{user.firstName}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Last Name</label>
                    <p className="form-control-static">{user.lastName}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Email</label>
                    <p className="form-control-static">{user.email}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Date of Birth</label>
                    <p className="form-control-static">
                      {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Phone Number</label>
                    <p className="form-control-static">{user.phoneNumber || 'Not set'}</p>
                  </div>
                </div>
              )}

              {showPasswordForm && (
                <div className="mt-4">
                  <h4>Change Password</h4>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Change Password
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setShowPasswordForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;