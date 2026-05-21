"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Home() {
  const sectionsRef = useRef([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    sectionsRef.current.forEach(s => {
      if (s && !s.classList.contains('hero')) {
        s.style.opacity = '0';
        s.style.transform = 'translateY(40px)';
        s.style.transition = 'opacity 1s ease, transform 1s ease';
        observer.observe(s);
      }
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <main>
      {/* HERO */}
      <section className="hero split-hero" ref={addToRefs}>
        <div className="hero-content">
          <div className="hero-ornament">Est. Delhi</div>
          <h1>Yash <br/>Designers</h1>
          <div className="hero-tagline">Beautiful outfits in modern designs.</div>
          <p className="hero-desc">Outfits that are in season and trending. <br/>Shipping worldwide.</p>
          <div className="hero-cta-group">
            <Link href="/shop" className="btn-pill-primary">Shop the Drop <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="gold-circle"></div>
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Model" className="hero-model" />
        </div>
      </section>

      {/* COLLECTIONS / PRODUCTS */}
      <section id="collections" className="collections" ref={addToRefs}>
        <div className="collection-header">
          <span className="section-label">Collections</span>
          <h2 className="section-title">Crafted in <span>drops</span>.</h2>
        </div>
        
        <div className="filter-row">
          {['All', 'Dresses', 'T-shirts', 'Denim', 'Jackets', 'Coats', 'Shoes'].map(f => (
            <div 
              key={f} 
              className={`filter-item ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              <div className="filter-icon">
                 {f === 'All' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg> : 
                  f === 'Dresses' ? '👗' : 
                  f === 'T-shirts' ? '👕' : 
                  f === 'Denim' ? '👖' : 
                  f === 'Jackets' ? '🧥' : 
                  f === 'Coats' ? '🥼' : '👟'}
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="product-grid">
          <div className="prod-card">
            <div className="prod-img">
              <img src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=500&q=80" alt="Product" />
            </div>
            <div className="prod-info">
              <h4>Acid Wash Flannel</h4>
              <div className="prod-price-row">
                <span className="prod-price">₹2499</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> 
                Explore
              </Link>
            </div>
          </div>

          <div className="prod-card active-sim">
            <div className="prod-img">
              <div className="prod-tags">
                <span className="ptag hot">Hot</span>
                <span className="ptag new">New</span>
              </div>
              <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&q=80" alt="Product" />
            </div>
            <div className="prod-info">
              <h4>Signature Drop Dress</h4>
              <div className="prod-price-row">
                <span className="prod-price">₹3999</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> 
                Explore
              </Link>
            </div>
          </div>

          <div className="prod-card">
            <div className="prod-img">
              <img src="https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=500&q=80" alt="Product" />
            </div>
            <div className="prod-info">
              <h4>Street Crop & Blazer</h4>
              <div className="prod-price-row">
                <span className="prod-price">₹4500</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> 
                Explore
              </Link>
            </div>
          </div>

          <div className="prod-card">
            <div className="prod-img">
              <img src="https://images.unsplash.com/photo-1485230895905-ef203e48102b?w=500&q=80" alt="Product" />
            </div>
            <div className="prod-info">
              <h4>Summer Floral Skirt</h4>
              <div className="prod-price-row">
                <span className="prod-price">₹1899</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> 
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={addToRefs}>
        <div className="about">
          <div className="about-content">
            <span className="section-label">The Brand</span>
            <h2 className="section-title">Style that <span>stands out</span>.</h2>
            <p>Yash Krishna Designs is a women's clothing shop based in Chandni Chowk, Delhi — offering beautiful outfits in modern designs that are in season and trending.</p>
            <p>Shipping worldwide. We ensure you get the best quality traditional and modern fusion wear.</p>
          </div>
          <div className="about-visual">
            <div className="visual-inner">
              <div className="hanger-icon">⌒</div>
              <div className="visual-text">DRIP HARD<br/>DRESS SHARP</div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" ref={addToRefs}>
        <div className="community-banner" style={{
          position: 'relative',
          padding: '80px 40px',
          borderRadius: '24px',
          background: 'linear-gradient(rgba(10,8,5,0.8), rgba(10,8,5,0.8)), url(https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200) center/cover',
          border: '1px solid rgba(212,162,58,0.2)',
          textAlign: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div className="community-content" style={{position: 'relative', zIndex: 2}}>
            <span className="section-label">@yash_krishna_designs_pvt_ltd</span>
            <h2 className="section-title" style={{marginBottom: '30px'}}>Join the <span>community</span>.</h2>
            <a href="https://instagram.com/hunkxapparel" target="_blank" rel="noopener noreferrer" className="btn-pill-secondary">Follow Us on Instagram</a>
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section id="visit" className="visit" ref={addToRefs}>
        <div className="visit-wrap">
          <div>
            <span className="section-label">Visit</span>
            <h2 className="section-title">Come see the <span>fits</span> in person.</h2>
            <div className="info-block">
              <div className="info-label">Address</div>
              <div className="info-value">954/4 Bhojpura Maliwara,<br/>Chandni Chowk, Nai Sarak,<br/>Delhi, India 110006</div>
            </div>
            <div className="info-block">
              <div className="info-label">Phone</div>
              <div className="info-value"><a href="tel:+917669933665">+91 76699 33665</a></div>
            </div>
            <div className="info-block">
              <div className="info-label">Instagram</div>
              <div className="info-value"><a href="https://instagram.com/yash_krishna_designs_pvt_ltd" target="_blank" rel="noopener noreferrer">@yash_krishna_designs_pvt_ltd</a></div>
            </div>
            <a href="https://maps.app.goo.gl/rHiqQWMH3msZEr2b8" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: '10px', borderRadius: '9999px' }}>Get Directions</a>
          </div>
          <div className="map-card">
            <div></div>
            <div className="map-pin">⚲</div>
            <div className="map-text">
              <h3>FLAGSHIP STORE</h3>
              <p>Opp. Vida Gym<br/>Sahibabad, Ghaziabad</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
