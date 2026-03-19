import { useState, useCallback } from 'react';
import { restaurantInfo } from '../data/restaurantData';
import Icon from '../components/Icon';
import ScrollAnimation from '../components/ScrollAnimation';
import './Contact.css';

export default function Contact() {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '2',
          message: ''
        });
      }, 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-bg"></div>
        <div className="container">
          <ScrollAnimation variant="fadeInDown">
            <h1>Contact Us</h1>
          </ScrollAnimation>
          <ScrollAnimation variant="fadeIn" delay={0.2}>
            <p>We'd love to hear from you</p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="contact-content section-padding">
        <div className="container">
          <div className="contact-grid">
            <ScrollAnimation variant="fadeInLeft" className="contact-info">
              <span className="section-label">Get in Touch</span>
              <h2 className="section-title">Visit Us Today</h2>
              <p className="contact-desc">
                Have questions about reservations, our menu, or want to plan a special event? 
                Reach out to us and our team will be happy to assist you.
              </p>

              <div className="contact-details">
                {[
                  { icon: 'location', title: 'Address', content: restaurantInfo.address },
                  { icon: 'phone', title: 'Phone', content: restaurantInfo.phone },
                  { icon: 'email', title: 'Email', content: restaurantInfo.email },
                  { icon: 'clock', title: 'Hours', content: ['Mon-Thu: 11AM-10PM', 'Fri-Sat: 11AM-12AM', 'Sun: 10AM-9PM'] }
                ].map((item, index) => (
                  <div key={index} className="contact-item">
                    <div className="contact-icon">
                      <Icon name={item.icon} />
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      {Array.isArray(item.content) ? (
                        item.content.map((line, i) => <p key={i}>{line}</p>)
                      ) : (
                        <p>{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-social">
                <h4>Follow Us</h4>
                <div className="social-links">
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
            </ScrollAnimation>

            <ScrollAnimation variant="fadeInRight" className="contact-form-wrapper">
              {isSubmitted ? (
                <div className="form-success">
                  <Icon name="success" />
                  <h3>Reservation Submitted!</h3>
                  <p>We'll confirm your booking shortly.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <h3>Make a Reservation</h3>
                  <p>Fill out the form below and we'll get back to you soon.</p>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                        placeholder="Your name"
                      />
                      {errors.name && <span className="error-msg">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="your@email.com"
                      />
                      {errors.email && <span className="error-msg">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="guests">Guests</label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date">Date *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={errors.date ? 'error' : ''}
                        min={today}
                      />
                      {errors.date && <span className="error-msg">{errors.date}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="time">Time *</label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={errors.time ? 'error' : ''}
                      >
                        <option value="">Select time</option>
                        {['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {errors.time && <span className="error-msg">{errors.time}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any special requests or dietary requirements?"
                      rows="4"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary submit-btn">
                    Confirm Reservation
                    <Icon name="arrowRight" />
                  </button>
                </form>
              )}
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <section className="map-section">
        <ScrollAnimation variant="fadeIn">
          <div className="map-placeholder">
            <div className="map-content">
              <Icon name="mapPin" />
              <h3>Find Us</h3>
              <p>{restaurantInfo.address}</p>
            </div>
          </div>
        </ScrollAnimation>
      </section>
    </div>
  );
}
