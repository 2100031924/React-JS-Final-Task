import { useState, useMemo, useCallback } from 'react';
import { useCart } from '../hooks/useCart';
import { menuItems, categories } from '../data/restaurantData';
import Icon from '../components/Icon';
import LazyImage from '../components/LazyImage';
import ScrollAnimation from '../components/ScrollAnimation';
import './Menu.css';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const { addItem } = useCart();

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredItems = useMemo(() => {
    let items = menuItems;
    
    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    
    return items;
  }, [activeCategory, searchQuery]);

  const handleAddToCart = useCallback((item) => {
    addItem(item);
    showToast(`${item.name} added to cart!`);
  }, [addItem]);

  return (
    <div className="menu-page">
      {toast && (
        <div className="menu-toast">
          <Icon name="check" />
          <span>{toast}</span>
        </div>
      )}
      <section className="menu-hero">
        <div className="menu-hero-bg"></div>
        <div className="container">
          <ScrollAnimation variant="fadeInDown">
            <h1>Our Menu</h1>
          </ScrollAnimation>
          <ScrollAnimation variant="fadeIn" delay={0.2}>
            <p>Discover our carefully curated selection of dishes</p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="menu-content section-padding">
        <div className="container">
          <ScrollAnimation variant="fadeIn" className="menu-filters">
            <div className="category-tabs">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="category-icon"><Icon name={category.icon} /></span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>

            <div className="search-box">
              <Icon name="search" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </ScrollAnimation>

          <div className="menu-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <ScrollAnimation key={item.id} variant="fadeInUp" delay={(index % 6) * 0.05}>
                  <MenuCard 
                    item={item} 
                    onAdd={handleAddToCart}
                  />
                </ScrollAnimation>
              ))
            ) : (
              <ScrollAnimation variant="fadeIn" className="no-results">
                <Icon name="search" />
                <h3>No dishes found</h3>
                <p>Try adjusting your search or category</p>
              </ScrollAnimation>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MenuCard({ item, onAdd }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    onAdd(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="menu-card hover-lift">
      <div className="menu-card-image">
        <LazyImage src={item.image} alt={item.name} />
        <div className="menu-card-overlay">
          <span className="prep-time">
            <Icon name="clock" />
            {item.preparationTime} min
          </span>
          {item.featured && <span className="featured-badge">Featured</span>}
        </div>
      </div>
      
      <div className="menu-card-content">
        <div className="menu-card-header">
          <h3>{item.name}</h3>
          <div className="menu-card-rating">
            <Icon name="star" /> {item.rating}
          </div>
        </div>
        <p className="menu-card-desc">{item.description}</p>
        
        <div className="menu-card-footer">
          <span className="menu-card-price">${item.price}</span>
          <button 
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleClick}
          >
            {isAdded ? (
              <>
                <Icon name="check" />
                Added
              </>
            ) : (
              <>
                <Icon name="cart" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
