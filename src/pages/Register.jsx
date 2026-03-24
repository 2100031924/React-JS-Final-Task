import { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import ScrollAnimation from '../components/ScrollAnimation';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateStep1 = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateStep2 = useCallback(() => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/login');
    } catch {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = useMemo(() => {
    const { password } = formData;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];
    
    return { 
      strength: Math.min(strength, 5), 
      label: labels[Math.min(strength - 1, 4)] || '',
      color: colors[Math.min(strength - 1, 4)] || ''
    };
  }, [formData.password]);

  return (
    <div className="auth-page register-page">
      <div className="auth-background">
        <div className="auth-shapes">
          <div className="auth-shape auth-shape-1"></div>
          <div className="auth-shape auth-shape-2"></div>
          <div className="auth-shape auth-shape-3"></div>
        </div>
      </div>

      <div className="auth-container">
        <ScrollAnimation variant="scaleIn" className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <Icon name="utensils" />
              <span>Rasoi</span>
            </Link>
            <h1>Create Account</h1>
            <p>Join our culinary community today</p>
          </div>

          <div className="step-indicator" role="navigation" aria-label="Registration steps">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <span className="step-number">
                {step > 1 ? <Icon name="check" /> : '1'}
              </span>
              <span className="step-label">Personal</span>
            </div>
            <div className="step-line" aria-hidden="true"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Security</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {errors.submit && (
              <div className="submit-error" role="alert">
                <Icon name="alert" />
                <span>{errors.submit}</span>
              </div>
            )}

            {step === 1 && (
              <ScrollAnimation variant="fadeIn">
                <div className={`form-group ${errors.name ? 'error' : ''}`}>
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <Icon name="user" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && <span id="name-error" className="error-text" role="alert">{errors.name}</span>}
                </div>

                <div className={`form-group ${errors.email ? 'error' : ''}`}>
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Icon name="email" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <span id="email-error" className="error-text" role="alert">{errors.email}</span>}
                </div>

                <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <Icon name="phone" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && <span id="phone-error" className="error-text" role="alert">{errors.phone}</span>}
                </div>

                <button type="button" className="auth-btn" onClick={handleNextStep} disabled={isLoading}>
                  Continue
                  <Icon name="arrowRight" />
                </button>
              </ScrollAnimation>
            )}

            {step === 2 && (
              <ScrollAnimation variant="fadeIn">
                <div className={`form-group ${errors.password ? 'error' : ''}`}>
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <Icon name="lock" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                      disabled={isLoading}
                    />
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      disabled={isLoading}
                    >
                      <Icon name={showPassword ? 'eyeOff' : 'eye'} />
                    </button>
                  </div>
                  {formData.password && (
                    <div className="password-strength" aria-live="polite">
                      <div className="strength-bars" role="progressbar" aria-valuenow={passwordStrength.strength} aria-valuemin="0" aria-valuemax="5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div 
                            key={i} 
                            className={`strength-bar ${i <= passwordStrength.strength ? 'active' : ''}`}
                            style={{ backgroundColor: i <= passwordStrength.strength ? passwordStrength.color : '#e2e8f0' }}
                          ></div>
                        ))}
                      </div>
                      <span className="strength-label" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                    </div>
                  )}
                  {errors.password ? (
                    <span id="password-error" className="error-text" role="alert">{errors.password}</span>
                  ) : (
                    <span id="password-hint" className="hint-text">Use 8+ characters with uppercase, lowercase and numbers</span>
                  )}
                </div>

                <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <Icon name="lock" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                      disabled={isLoading}
                    />
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      disabled={isLoading}
                    >
                      <Icon name={showConfirmPassword ? 'eyeOff' : 'eye'} />
                    </button>
                  </div>
                  {errors.confirmPassword && <span id="confirm-password-error" className="error-text" role="alert">{errors.confirmPassword}</span>}
                </div>

                <div className={`form-group checkbox-group ${errors.agreeTerms ? 'error' : ''}`}>
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      aria-describedby={errors.agreeTerms ? 'terms-error' : undefined}
                      disabled={isLoading}
                    />
                    <span className="checkmark" aria-hidden="true">
                      <Icon name="check" />
                    </span>
                    <span>I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link> and <Link to="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link></span>
                  </label>
                  {errors.agreeTerms && <span id="terms-error" className="error-text" role="alert">{errors.agreeTerms}</span>}
                </div>

                <div className="button-group">
                  <button type="button" className="auth-btn secondary" onClick={handlePrevStep} disabled={isLoading}>
                    <Icon name="arrowLeft" />
                    Back
                  </button>
                  <button type="submit" className={`auth-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                    {isLoading ? (
                      <span className="loader" aria-label="Creating account..."></span>
                    ) : (
                      <>
                        Create Account
                        <Icon name="arrowRight" />
                      </>
                    )}
                  </button>
                </div>
              </ScrollAnimation>
            )}
          </form>

          <div className="auth-divider">
            <span>or sign up with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn" aria-label="Sign up with Google" disabled={isLoading}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
            <button type="button" className="social-btn" aria-label="Sign up with Facebook" disabled={isLoading}>
              <Icon name="facebook" />
              <span>Facebook</span>
            </button>
            <button type="button" className="social-btn" aria-label="Sign up with Twitter" disabled={isLoading}>
              <Icon name="twitter" />
              <span>Twitter</span>
            </button>
          </div>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </ScrollAnimation>

        <div className="auth-info register-info" aria-hidden="true">
          <ScrollAnimation variant="fadeInLeft" delay={0.3}>
            <h2>Join Our Community</h2>
            <p>Create an account to unlock exclusive benefits and enhance your dining experience.</p>
            <ul className="feature-list">
              <li><Icon name="check" /> <span>Exclusive member discounts</span></li>
              <li><Icon name="check" /> <span>Priority reservations</span></li>
              <li><Icon name="check" /> <span>Personalized recommendations</span></li>
              <li><Icon name="check" /> <span>Order history & favorites</span></li>
              <li><Icon name="check" /> <span>Special birthday rewards</span></li>
            </ul>
            <div className="testimonial-card">
              <p>"Joining Rasoi was the best decision! The deals are amazing and the service is exceptional."</p>
              <div className="testimonial-author">
                <div className="author-avatar">AR</div>
                <div>
                  <strong>Ananya Reddy</strong>
                  <span>Premium Member</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}
