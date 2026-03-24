import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Icon from './Icon';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', color: 'home' },
    { path: '/menu', label: 'Menu', color: 'menu' },
    { path: '/about', label: 'About', color: 'about' },
    { path: '/services', label: 'Services', color: 'services' },
    { path: '/contact', label: 'Contact', color: 'contact' }
  ];

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><Icon name="utensils" /></span>
          <span className="logo-text">Rasoi</span>
        </Link>

        <nav className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navLinks.map(({ path, label, color }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-link nav-${color} ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <Link 
            to="/login" 
            className="nav-auth-btn"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="auth-btn-desktop">
            Login
          </Link>
          <button className="cart-btn" onClick={toggleCart} aria-label="Shopping cart">
            <Icon name="cart" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          <button
            className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
