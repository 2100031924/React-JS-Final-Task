import { Link } from 'react-router-dom';
import { restaurantInfo } from '../data/restaurantData';
import Icon from './Icon';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon"><Icon name="utensils" /></span>
              <span className="logo-text">Rasoi</span>
            </Link>
            <p className="footer-tagline">{restaurantInfo.tagline}</p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <Icon name="facebook" />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Icon name="twitter" />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/menu">Order Online</Link></li>
              <li><Link to="/contact">Reservations</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Contact</h4>
            <ul>
              <li className="contact-item">
                <Icon name="location" />
                <span>{restaurantInfo.address}</span>
              </li>
              <li className="contact-item">
                <Icon name="phone" />
                <span>{restaurantInfo.phone}</span>
              </li>
              <li className="contact-item">
                <Icon name="email" />
                <span>{restaurantInfo.email}</span>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Hours</h4>
            <ul>
              <li>Mon-Thu: 11AM-10PM</li>
              <li>Fri-Sat: 11AM-12AM</li>
              <li>Sun: 10AM-9PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Rasoi Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
