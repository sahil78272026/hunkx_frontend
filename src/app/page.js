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
          <div className="hero-ornament">Est. Ghaziabad</div>
          <h1>Stylish <br/>Clothes</h1>
          <div className="hero-tagline">Drip Hard. Dress Sharp.</div>
          <p className="hero-desc">Made from Soft, Durable, Premium Fabrics. <br/>A wardrobe built for people who don't blend in.</p>
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
      {/* MEN'S COLLECTION */}
      <section id="mens-collection" className="collections" ref={addToRefs} style={{paddingTop: '60px', paddingBottom: '40px'}}>
        <div className="collection-header">
          <span className="section-label" style={{color: 'var(--gold-bright)'}}>For Him</span>
          <h2 className="section-title">Boss-Level <span>Sophistication</span></h2>
          <p style={{textAlign: 'center', color: 'var(--cream)', opacity: 0.8, maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem'}}>
            Premium fits, earth-tone essentials, and retro athletic streetwear curated for the modern man.
          </p>
        </div>
        
        <div className="product-grid">
          <div className="prod-card active-sim">
            <div className="prod-img">
              <div className="prod-tags"><span className="ptag hot">Must Have</span></div>
              <img src="https://rlrcugmcgkbuhridzryj.supabase.co/storage/v1/object/public/hunkx_storage_sb/products/mens-smart-brown.jpeg" alt="Brown BOSS Tee" />
            </div>
            <div className="prod-info">
              <h4>Earth-Tone Smart Casual Fit</h4>
              <p style={{fontSize: '0.8rem', color: 'gray', marginBottom: '10px', height: '40px'}}>Fitted brown tee styled with beige tailored trousers.</p>
              <div className="prod-price-row">
                <span className="prod-price">₹2499</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Shop Now
              </Link>
            </div>
          </div>

          <div className="prod-card">
            <div className="prod-img">
              <div className="prod-tags"><span className="ptag new">Vintage</span></div>
              <img src="https://rlrcugmcgkbuhridzryj.supabase.co/storage/v1/object/public/hunkx_storage_sb/products/mens-sports-red.jpeg" alt="Retro Sports Tee" />
            </div>
            <div className="prod-info">
              <h4>Retro Athletic Streetwear</h4>
              <p style={{fontSize: '0.8rem', color: 'gray', marginBottom: '10px', height: '40px'}}>Red & black graphic tee paired with oversized vintage denim.</p>
              <div className="prod-price-row">
                <span className="prod-price">₹2199</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Shop Now
              </Link>
            </div>
          </div>

          <div className="prod-card">
            <div className="prod-img">
              <img src="https://rlrcugmcgkbuhridzryj.supabase.co/storage/v1/object/public/hunkx_storage_sb/products/mens-smart-burgundy.jpeg" alt="Burgundy Smart Casual" />
            </div>
            <div className="prod-info">
              <h4>Burgundy Elegance Fit</h4>
              <p style={{fontSize: '0.8rem', color: 'gray', marginBottom: '10px', height: '40px'}}>Fitted burgundy tee for that elevated everyday look.</p>
              <div className="prod-price-row">
                <span className="prod-price">₹2499</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WOMEN'S COLLECTION */}
      <section id="womens-collection" className="collections" ref={addToRefs} style={{paddingTop: '40px', paddingBottom: '80px', background: 'transparent'}}>
        <div className="collection-header">
          <span className="section-label" style={{color: 'var(--gold-deep)'}}>For Her</span>
          <h2 className="section-title">Bold <span>Streetwear</span></h2>
          <p style={{textAlign: 'center', color: 'var(--cream)', opacity: 0.8, maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem'}}>
            Vibrant jerseys, edgy flame graphics, and utility-inspired aesthetics to make a statement.
          </p>
        </div>
        
        <div className="product-grid">
          <div className="prod-card active-sim">
            <div className="prod-img">
              <div className="prod-tags"><span className="ptag hot">Trending</span></div>
              <img src="https://rlrcugmcgkbuhridzryj.supabase.co/storage/v1/object/public/hunkx_storage_sb/products/womens-sports-purple.jpeg" alt="Purple Oversized Jersey" />
            </div>
            <div className="prod-info">
              <h4>Vibrant '08 Flying' Jersey</h4>
              <p style={{fontSize: '0.8rem', color: 'gray', marginBottom: '10px', height: '40px'}}>Bold purple athletic streetwear paired with distressed denim.</p>
              <div className="prod-price-row">
                <span className="prod-price">₹1899</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Shop Now
              </Link>
            </div>
          </div>

          <div className="prod-card">
            <div className="prod-img">
              <div className="prod-tags"><span className="ptag new">Street</span></div>
              <img src="https://rlrcugmcgkbuhridzryj.supabase.co/storage/v1/object/public/hunkx_storage_sb/products/womens-streetwear-black.jpeg" alt="Flame Graphic Jersey" />
            </div>
            <div className="prod-info">
              <h4>'88' Flame Graphic Jersey</h4>
              <p style={{fontSize: '0.8rem', color: 'gray', marginBottom: '10px', height: '40px'}}>Turn up the heat with oversized edgy black streetwear.</p>
              <div className="prod-price-row">
                <span className="prod-price">₹1999</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Shop Now
              </Link>
            </div>
          </div>

          <div className="prod-card">
            <div className="prod-img">
              <img src="https://rlrcugmcgkbuhridzryj.supabase.co/storage/v1/object/public/hunkx_storage_sb/products/womens-utility-camo.jpeg" alt="Utility Crop & Camo" />
            </div>
            <div className="prod-info">
              <h4>Utility Crop & Camo Fit</h4>
              <p style={{fontSize: '0.8rem', color: 'gray', marginBottom: '10px', height: '40px'}}>Olive brown long-sleeve crop top with relaxed cargo pants.</p>
              <div className="prod-price-row">
                <span className="prod-price">₹2899</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Shop Now
              </Link>
            </div>
          </div>

          <div className="prod-card">
            <div className="prod-img">
              <img src="https://rlrcugmcgkbuhridzryj.supabase.co/storage/v1/object/public/hunkx_storage_sb/products/womens-streetwear-white.jpeg" alt="Star Pattern Jersey" />
            </div>
            <div className="prod-info">
              <h4>'22' Star Pattern Jersey</h4>
              <p style={{fontSize: '0.8rem', color: 'gray', marginBottom: '10px', height: '40px'}}>White and navy oversized jersey for chic urban vibes.</p>
              <div className="prod-price-row">
                <span className="prod-price">₹1899</span>
                <button className="prod-heart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <Link href="/shop" className="prod-add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Shop Now
              </Link>
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
            <span className="section-label">@hunkxapparel</span>
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
              <div className="info-value">6/1B, Shop No. 5, Sec-5,<br/>Rajender Nagar, Sahibabad,<br/>Ghaziabad, U.P. 201005</div>
            </div>
            <div className="info-block">
              <div className="info-label">Phone</div>
              <div className="info-value"><a href="tel:+917669933665">+91 76699 33665</a></div>
            </div>
            <div className="info-block">
              <div className="info-label">Instagram</div>
              <div className="info-value"><a href="https://instagram.com/hunkxapparel" target="_blank" rel="noopener noreferrer">@hunkxapparel</a></div>
            </div>
            <a href="https://maps.app.goo.gl/rHiqQWMH3msZEr2b8" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: '10px', borderRadius: '9999px' }}>Get Directions</a>
          </div>
          <div className="map-card" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'transparent' }}>
            <img src="https://rlrcugmcgkbuhridzryj.supabase.co/storage/v1/object/public/hunkx_storage_sb/products/map-screenshot.png" alt="Google Map Location" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
        </div>
      </section>
    </main>
  );
}
