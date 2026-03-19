import { teamMembers } from '../data/restaurantData';
import Icon from '../components/Icon';
import LazyImage from '../components/LazyImage';
import ScrollAnimation from '../components/ScrollAnimation';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="container">
          <ScrollAnimation variant="fadeInDown">
            <h1>About Us</h1>
          </ScrollAnimation>
          <ScrollAnimation variant="fadeIn" delay={0.2}>
            <p>Discover our story and passion for culinary excellence</p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="story section-padding">
        <div className="container">
          <div className="story-grid">
            <ScrollAnimation variant="fadeInLeft" className="story-content">
              <span className="section-label">Our Story</span>
              <h2 className="section-title">A Legacy of Authentic Flavors</h2>
              <p>
                Founded in 2008, Rasoi began as a small family kitchen with a simple mission: 
                to bring authentic, high-quality Indian cuisine to our community. Over the years, 
                we've grown into one of Mumbai's most beloved fine dining destinations.
              </p>
              <p>
                Our philosophy is simple - use only the freshest spices, prepare every 
                dish with care, and create an experience that lingers in memory long after 
                the last bite. We source our ingredients from local farms and partner with 
                trusted suppliers who share our commitment to quality.
              </p>
              <p>
                Every dish that leaves our kitchen tells a story of tradition, innovation, 
                and passion. We believe that dining should be more than just a meal; it 
                should be an unforgettable journey through the flavors of India.
              </p>
            </ScrollAnimation>
            <ScrollAnimation variant="fadeInRight" className="story-images">
              <div className="story-img-main">
                <LazyImage src="/images/restaurant-interior.jpg" alt="Restaurant interior" />
              </div>
              <div className="story-img-secondary">
                <LazyImage src="/images/paneer-tikka.jpg" alt="Chef preparing food" />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <section className="stats section-padding">
        <div className="container">
          <div className="stats-grid">
            {[
              { number: '20+', label: 'Years of Excellence' },
              { number: '50K+', label: 'Happy Guests' },
              { number: '100+', label: 'Signature Dishes' },
              { number: '15', label: 'Expert Chefs' }
            ].map((stat, index) => (
              <ScrollAnimation key={index} variant="scaleIn" delay={index * 0.1}>
                <div className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="team section-padding">
        <div className="container">
          <ScrollAnimation variant="fadeIn">
            <span className="section-label">Our Team</span>
            <h2 className="section-title">Meet the Masters</h2>
            <p className="section-subtitle">
              The talented individuals who bring magic to every dish
            </p>
          </ScrollAnimation>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <ScrollAnimation key={member.id} variant="fadeInUp" delay={index * 0.1}>
                <div className="team-card hover-lift">
                  <div className="team-image">
                    <LazyImage src={member.image} alt={member.name} />
                    <div className="team-social">
                      <a href="#" aria-label="Instagram">
                        <Icon name="instagram" />
                      </a>
                      <a href="#" aria-label="LinkedIn">
                        <Icon name="linkedin" />
                      </a>
                    </div>
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <span className="team-role">{member.role}</span>
                    <p>{member.bio}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="values section-padding">
        <div className="container">
          <ScrollAnimation variant="fadeIn">
            <span className="section-label">Our Values</span>
            <h2 className="section-title">What We Stand For</h2>
          </ScrollAnimation>
          
          <div className="values-grid">
            {[
              { icon: 'leaf', title: 'Sustainability', desc: 'We prioritize local sourcing and sustainable practices in everything we do.' },
              { icon: 'heart', title: 'Passion', desc: 'Every dish is crafted with love and dedication to culinary excellence.' },
              { icon: 'handshake', title: 'Community', desc: 'We believe in building lasting relationships with our guests and suppliers.' },
              { icon: 'star', title: 'Quality', desc: 'We never compromise on the quality of our ingredients or service.' }
            ].map((value, index) => (
              <ScrollAnimation key={index} variant="fadeInUp" delay={index * 0.1}>
                <div className="value-card hover-lift">
                  <div className="value-icon"><Icon name={value.icon} /></div>
                  <h3>{value.title}</h3>
                  <p>{value.desc}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
