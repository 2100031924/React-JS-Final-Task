import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import ScrollAnimation from '../components/ScrollAnimation';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../context/AuthContext';
import { useAnalytics, useFeatureFlags } from '../hooks/useAuthHooks';
import { sanitizeEmail, sanitizeInput, setCSRFToken } from '../utils/sanitize';
import './Auth.css';

const FORM_CONFIG = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  MIN_PASSWORD_LENGTH: 6,
  VALIDATION_DELAY: 300,
};

function validateEmail(value) {
  if (!value.trim()) return 'Email is required';
  if (!FORM_CONFIG.EMAIL_REGEX.test(value)) return 'Please enter a valid email';
  return '';
}

function validatePassword(value) {
  if (!value) return 'Password is required';
  if (value.length < FORM_CONFIG.MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${FORM_CONFIG.MIN_PASSWORD_LENGTH} characters`;
  }
  return '';
}

function LoginContent() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isLockedOut, getRemainingLockoutTime } = useAuth();
  const { trackLoginAttempt, trackLoginSuccess, trackLoginFailure } = useAnalytics();
  const { flags } = useFeatureFlags();

  const formRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const lockoutRemaining = useMemo(() => {
    if (!isLockedOut()) return 0;
    return getRemainingLockoutTime();
  }, [isLockedOut, getRemainingLockoutTime]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    setCSRFToken();
    if (!isLockedOut()) {
      emailRef.current?.focus();
    }
  }, [isLockedOut]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = type === 'checkbox' ? checked : sanitizeInput(value);

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

    if (error) clearError();

    if (submitAttempted || touched[name]) {
      const validator = name === 'email' ? validateEmail : validatePassword;
      const fieldError = validator(sanitizedValue);
      setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  }, [error, clearError, submitAttempted, touched]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const validator = name === 'email' ? validateEmail : validatePassword;
    const fieldError = validator(value);
    setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setFieldErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      const firstErrorField = emailError ? emailRef : passwordRef;
      firstErrorField.current?.focus();
      return;
    }

    if (isLockedOut()) return;

    trackLoginAttempt();

    const result = await login(
      sanitizeEmail(formData.email),
      sanitizeInput(formData.password),
      formData.rememberMe
    );

    if (result.success) {
      trackLoginSuccess('email');
      navigate('/');
    } else {
      trackLoginFailure(result.error);
      passwordRef.current?.focus();
      setFormData(prev => ({ ...prev, password: '' }));
    }
  }, [formData, isLockedOut, login, navigate, trackLoginAttempt, trackLoginSuccess, trackLoginFailure]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && error) {
      clearError();
    }
  }, [error, clearError]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
    passwordRef.current?.focus();
  }, []);

  const socialProviders = useMemo(() => {
    const providers = [];
    if (flags.socialLoginGoogle) {
      providers.push({
        name: 'Google',
        icon: (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        ),
      });
    }
    if (flags.socialLoginFacebook) {
      providers.push({ name: 'Facebook', icon: <Icon name="facebook" /> });
    }
    if (flags.socialLoginTwitter) {
      providers.push({ name: 'Twitter', icon: <Icon name="twitter" /> });
    }
    return providers;
  }, [flags]);

  return (
    <div
      className="auth-page"
      onKeyDown={handleKeyDown}
      role="main"
      aria-labelledby="login-heading"
    >
      <div className="auth-background" aria-hidden="true">
        <div className="auth-shapes">
          <div className="auth-shape auth-shape-1"></div>
          <div className="auth-shape auth-shape-2"></div>
          <div className="auth-shape auth-shape-3"></div>
        </div>
      </div>

      <div className="auth-container">
        <ScrollAnimation variant="scaleIn" className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo" aria-label="Go to home page">
              <Icon name="utensils" />
              <span>Rasoi</span>
            </Link>
            <h1 id="login-heading">Welcome Back</h1>
            <p>Sign in to continue your culinary journey</p>
          </div>

          {error && (
            <div
              className="submit-error"
              role="alert"
              aria-live="assertive"
              id="login-error"
            >
              <Icon name="alert" />
              <span>{error}</span>
              <button
                type="button"
                className="error-dismiss"
                onClick={clearError}
                aria-label="Dismiss error"
              >
                <Icon name="close" />
              </button>
            </div>
          )}

          {isLockedOut() && (
            <div className="lockout-notice" role="alert" aria-live="assertive">
              <Icon name="lock" />
              <p>
                Account temporarily locked. Please try again in{' '}
                <strong>{Math.ceil(lockoutRemaining / 60)} minutes</strong>.
              </p>
            </div>
          )}

          <form
            ref={formRef}
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={error ? 'login-error' : undefined}
          >
            <input type="hidden" name="_csrf" value={setCSRFToken()} readOnly />

            <div className={`form-group ${fieldErrors.email ? 'error' : ''} ${touched.email ? 'touched' : ''}`}>
              <label htmlFor="login-email">Email Address</label>
              <div className="input-wrapper">
                <Icon name="email" />
                <input
                  ref={emailRef}
                  type="email"
                  id="login-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  autoComplete="username email"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  aria-invalid={!!fieldErrors.email}
                  aria-required="true"
                  disabled={isLoading || isLockedOut()}
                  maxLength={254}
                />
              </div>
              {fieldErrors.email && (
                <span id="email-error" className="error-text" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className={`form-group ${fieldErrors.password ? 'error' : ''} ${touched.password ? 'touched' : ''}`}>
              <label htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <Icon name="lock" />
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  aria-invalid={!!fieldErrors.password}
                  aria-required="true"
                  disabled={isLoading || isLockedOut()}
                  maxLength={128}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  disabled={isLoading || isLockedOut()}
                  tabIndex={0}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} />
                </button>
              </div>
              {fieldErrors.password && (
                <span id="password-error" className="error-text" role="alert">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className="form-options">
              {flags.rememberMe && (
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading || isLockedOut()}
                    aria-label="Remember me for 30 days"
                  />
                  <span className="checkmark" aria-hidden="true">
                    <Icon name="check" />
                  </span>
                  <span>Remember me</span>
                </label>
              )}
              <Link
                to="/forgot-password"
                className="forgot-link"
                aria-label="Reset your password"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className={`auth-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || isLockedOut()}
              aria-busy={isLoading}
              aria-disabled={isLoading || isLockedOut()}
            >
              {isLoading ? (
                <>
                  <span className="loader" aria-hidden="true"></span>
                  <span className="visually-hidden">Signing in...</span>
                </>
              ) : (
                <>
                  Sign In
                  <Icon name="arrowRight" />
                </>
              )}
            </button>
          </form>

          {socialProviders.length > 0 && (
            <>
              <div className="auth-divider" role="separator">
                <span>or continue with</span>
              </div>

              <div className="social-login" role="group" aria-label="Social login options">
                {socialProviders.map(provider => (
                  <button
                    key={provider.name}
                    type="button"
                    className="social-btn"
                    aria-label={`Sign in with ${provider.name}`}
                    disabled={isLoading || isLockedOut()}
                  >
                    {provider.icon}
                    <span>{provider.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" aria-label="Create a new account">
                Create Account
              </Link>
            </p>
          </div>
        </ScrollAnimation>

        <div className="auth-info" aria-hidden="true">
          <ScrollAnimation variant="fadeInLeft" delay={0.3}>
            <h2>Experience Fine Dining</h2>
            <p>
              Sign in to access exclusive reservations, order history, and
              personalized recommendations.
            </p>
            <ul className="feature-list">
              <li><Icon name="check" /> <span>Quick online ordering</span></li>
              <li><Icon name="check" /> <span>Table reservations</span></li>
              <li><Icon name="check" /> <span>Exclusive member offers</span></li>
              <li><Icon name="check" /> <span>Order tracking</span></li>
            </ul>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <ErrorBoundary>
      <LoginContent />
    </ErrorBoundary>
  );
}
