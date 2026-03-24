import { useState, useEffect } from 'react';
import { profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  
  const [infoForm, setInfoForm] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setProfile(response.data);
      setInfoForm({
        fullName: response.data.fullName || '',
        phone: response.data.phone || '',
        address: response.data.address || ''
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInfoChange = (e) => {
    setInfoForm({ ...infoForm, [e.target.name]: e.target.value });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await profileService.updateProfile(infoForm);
      setSuccess('Profile updated successfully');
      fetchProfile();
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await profileService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setSuccess('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile?.fullName?.charAt(0) || profile?.username?.charAt(0) || 'U'}
          </div>
          <div className="profile-info">
            <h2>{profile?.fullName || profile?.username}</h2>
            <p>{profile?.email}</p>
            <span className={`badge ${profile?.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
              {profile?.role}
            </span>
          </div>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Personal Info
          </button>
          <button
            className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>
        
        <div className="card">
          {activeTab === 'info' && (
            <form onSubmit={handleInfoSubmit}>
              <div className="profile-grid">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="input"
                    value={profile?.username || ''}
                    disabled
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={profile?.email || ''}
                    disabled
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="input"
                    value={infoForm.fullName}
                    onChange={handleInfoChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="input"
                    value={infoForm.phone}
                    onChange={handleInfoChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="input"
                  value={infoForm.address}
                  onChange={handleInfoChange}
                />
              </div>
              
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </form>
          )}
          
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              {profile?.provider === 'local' ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      className="input"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="input"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="input"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </>
              ) : (
                <div className="alert alert-error">
                  You are logged in via {profile?.provider}. Password cannot be changed locally.
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
