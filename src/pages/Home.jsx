import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { services, testimonials, menuItems } from '../data/restaurantData';
import Icon from '../components/Icon';
import AnimatedCounter from '../components/AnimatedCounter';
import LazyImage from '../components/LazyImage';
import ScrollAnimation from '../components/ScrollAnimation';
import './Home.css';

export default function Home() {
  const featuredDishes = menuItems.filter(item => item.featured).slice(0, 3);

  const stats = [
    { value: 20, suffix: '+', label: 'Years Experience' },
    { value: 50, suffix: '+', label: 'Menu Items' },
    { value: 15, suffix: 'K+', label: 'Happy Customers' },
    { value: 4.9, suffix: '', label: 'Average Rating' }
  ];

  const handleCardMouse = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <ScrollAnimation variant="fadeInDown" duration={0.6}>
            <span className="hero-label">Welcome to Rasoi</span>
          </ScrollAnimation>
          <ScrollAnimation variant="fadeInUp" duration={0.8} delay={0.2}>
            <h1 className="hero-title">
              Experience the Art of <span>Fine Dining</span>
            </h1>
          </ScrollAnimation>
          <ScrollAnimation variant="fadeIn" duration={0.8} delay={0.4}>
            <p className="hero-desc">
              Indulge in exquisite cuisine crafted with passion and the finest ingredients. 
              Every dish tells a story of culinary excellence.
            </p>
          </ScrollAnimation>
          <ScrollAnimation variant="fadeInUp" duration={0.8} delay={0.6}>
            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary">
                View Menu
                <Icon name="arrowRight" />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Book a Table
              </Link>
            </div>
          </ScrollAnimation>
        </div>
        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-indicator">
            <div className="scroll-dot"></div>
          </div>
        </div>
      </section>

      <section className="stats section-padding">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <ScrollAnimation key={index} variant="scaleIn" delay={index * 0.1}>
                <div className="stat-item scale-in">
                  <div className="stat-value">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="features section-padding">
        <div className="container">
          <div className="features-grid">
            {services.slice(0, 3).map((service, index) => (
              <ScrollAnimation key={service.id} variant="fadeInUp" delay={index * 0.15}>
                <div className="feature-card hover-lift spotlight-card" onMouseMove={handleCardMouse}>
                  <div className="feature-icon"><Icon name={service.icon} /></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="about-preview section-padding">
        <div className="container">
          <div className="about-grid">
            <ScrollAnimation variant="fadeInLeft" className="about-image">
              <LazyImage src="/images/restaurant-interior.jpg" alt="Restaurant interior" />
              <div className="about-image-accent"></div>
            </ScrollAnimation>
            <ScrollAnimation variant="fadeInRight" className="about-content">
              <span className="section-label">About Us</span>
              <h2 className="section-title">A Legacy of Culinary Excellence</h2>
              <p>
                For over two decades, Rasoi has been the pinnacle of fine Indian dining in our city. 
                Our commitment to authentic spices, innovative recipes, and impeccable service 
                has made us a destination for food enthusiasts worldwide.
              </p>
              <p>
                Every dish that leaves our kitchen is a testament to our passion for culinary art. 
                We source our ingredients from local farms and trusted suppliers to ensure 
                freshness and sustainability.
              </p>
              <Link to="/about" className="btn btn-outline">
                Learn More
              </Link>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <section className="featured section-padding">
        <div className="container">
          <ScrollAnimation variant="fadeIn">
            <span className="section-label">Featured Dishes</span>
            <h2 className="section-title">Chef's Recommendations</h2>
            <p className="section-subtitle">Discover our most beloved creations</p>
          </ScrollAnimation>
          
          <div className="featured-grid">
            {featuredDishes.map((dish, index) => (
              <ScrollAnimation key={dish.id} variant="fadeInUp" delay={index * 0.15}>
                <div className="featured-card hover-lift spotlight-card gradient-border" onMouseMove={handleCardMouse}>
                  <div className="featured-image">
                    <LazyImage src={dish.image} alt={dish.name} />
                    <div className="featured-overlay">
                      <span className="rating"><Icon name="star" /> {dish.rating}</span>
                    </div>
                  </div>
                  <div className="featured-info">
                    <h3>{dish.name}</h3>
                    <p>{dish.description}</p>
                    <div className="featured-footer">
                      <span className="price">${dish.price}</span>
                      <Link to="/menu" className="order-btn">Order Now</Link>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials section-padding">
        <div className="container">
          <ScrollAnimation variant="fadeIn">
            <span className="section-label">Testimonials</span>
            <h2 className="section-title">What Our Guests Say</h2>
          </ScrollAnimation>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimation key={testimonial.id} variant="fadeInUp" delay={index * 0.1}>
                <div className="testimonial-card hover-lift">
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="star" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <LazyImage src={testimonial.image} alt={testimonial.name} />
                    <span>{testimonial.name}</span>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="cta section-padding">
        <div className="cta-bg">
          <div className="container">
            <ScrollAnimation variant="fadeInUp" className="cta-content">
              <h2>Ready for an Unforgettable Experience?</h2>
              <div className="deco-divider">
                <Icon name="star" />
              </div>
              <p>Book your table today and discover why Rasoi is the city's favorite fine dining destination.</p>
              <div className="cta-actions">
                <Link to="/contact" className="btn btn-primary">
                  Book a Table
                </Link>
                <Link to="/menu" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                  View Menu
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </>
  );
}
