import { Link } from 'react-router-dom';
import { services } from '../data/restaurantData';
import Icon from '../components/Icon';
import LazyImage from '../components/LazyImage';
import ScrollAnimation from '../components/ScrollAnimation';
import './Services.css';

export default function Services() {
  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-hero-bg"></div>
        <div className="container">
          <ScrollAnimation variant="fadeInDown">
            <h1>Our Services</h1>
          </ScrollAnimation>
          <ScrollAnimation variant="fadeIn" delay={0.2}>
            <p>Experience premium dining and event services</p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="services-content section-padding">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <ScrollAnimation key={service.id} variant="fadeInUp" delay={index * 0.1}>
                <div className="service-card hover-lift">
                  <div className="service-image">
                    <LazyImage src={service.image} alt={service.title} />
                    <div className="service-overlay">
                      <span className="service-icon"><Icon name={service.icon} /></span>
                    </div>
                  </div>
                  <div className="service-content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <Link to="/contact" className="service-link">
                      Learn More
                      <Icon name="arrowRight" />
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="features-detailed section-padding">
        <div className="container">
          <ScrollAnimation variant="fadeIn">
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title">The Rasoi Experience</h2>
            <p className="section-subtitle">What sets us apart from the rest</p>
          </ScrollAnimation>
          
          <div className="features-detailed-grid">
            {[
              { icon: 'home', title: 'Award-Winning Cuisine', desc: 'Our chefs have received numerous accolades for their innovative approach to classic dishes.' },
              { icon: 'users', title: 'Personalized Service', desc: 'Our dedicated staff ensures every guest receives attention tailored to their preferences.' },
              { icon: 'shield', title: 'Premium Ingredients', desc: 'We source only the finest, freshest ingredients from trusted local suppliers.' },
              { icon: 'grid', title: 'Elegant Ambiance', desc: 'Our beautifully designed spaces create the perfect atmosphere for any occasion.' }
            ].map((feature, index) => (
              <ScrollAnimation key={index} variant="fadeInUp" delay={index * 0.1}>
                <div className="feature-detailed-card hover-lift">
                  <div className="feature-detailed-icon">
                    <Icon name={feature.icon} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing section-padding">
        <div className="container">
          <ScrollAnimation variant="fadeIn">
            <span className="section-label">Packages</span>
            <h2 className="section-title">Event Packages</h2>
            <p className="section-subtitle">Choose the perfect package for your special occasion</p>
          </ScrollAnimation>
          
          <div className="pricing-grid">
            {[
              {
                name: 'Essential',
                price: '500',
                desc: 'Perfect for small gatherings',
                features: ['Up to 20 guests', 'Custom menu selection', 'Basic decorations', 'Dedicated server', '3-hour rental'],
                featured: false
              },
              {
                name: 'Premium',
                price: '1,200',
                desc: 'Ideal for celebrations',
                features: ['Up to 50 guests', 'Full catering service', 'Premium decorations', 'Dedicated staff team', '5-hour rental', 'Live music option'],
                featured: true
              },
              {
                name: 'Luxury',
                price: '2,500',
                desc: 'For grand occasions',
                features: ['Up to 100 guests', 'Full-course gourmet menu', 'Custom theme & decor', 'Full service team', 'Full-day rental', 'Entertainment included'],
                featured: false
              }
            ].map((pkg, index) => (
              <ScrollAnimation key={pkg.name} variant="fadeInUp" delay={index * 0.15}>
                <div className={`pricing-card hover-lift ${pkg.featured ? 'featured' : ''}`}>
                  {pkg.featured && <div className="featured-tag">Most Popular</div>}
                  <div className="pricing-header">
                    <h3>{pkg.name}</h3>
                    <div className="pricing-price">
                      <span className="currency">$</span>
                      <span className="amount">{pkg.price}</span>
                    </div>
                    <p>{pkg.desc}</p>
                  </div>
                  <ul className="pricing-features">
                    {pkg.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className={`btn ${pkg.featured ? 'btn-primary' : 'btn-outline'}`}>
                    Book Now
                  </Link>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
