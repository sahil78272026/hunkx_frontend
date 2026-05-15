"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const sectionsRef = useRef([]);

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
      <section className="hero" ref={addToRefs}>
        <div className="curtain left"></div>
        <div className="curtain right"></div>
        <div>
          <div className="hero-ornament">Est. Ghaziabad</div>
          <h1>HUNKX</h1>
          <div className="hero-tagline">Drip Hard. Dress Sharp.</div>
          <div className="hero-sub">Unisex Clothing</div>
          <div className="hero-cta-group">
            <a href="#collections" className="btn-primary">Shop Collections</a>
            <a href="#visit" className="btn-secondary">Visit Store</a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={addToRefs}>
        <div className="about">
          <div className="about-content">
            <span className="section-label">The Brand</span>
            <h2 className="section-title">Style that <span>commands</span> the street.</h2>
            <p>Hunkx is a unisex clothing label born in Ghaziabad — for those who treat every outfit like a statement. Bold cuts. Confident silhouettes. A wardrobe built for people who don't blend in.</p>
            <p>From acid-washed denim to sharp seasonal drops, every piece is curated to help you drip hard and dress sharp.</p>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-num">78+</div>
                <div className="stat-label">Drops</div>
              </div>
              <div className="stat">
                <div className="stat-num">90+</div>
                <div className="stat-label">Community</div>
              </div>
              <div className="stat">
                <div className="stat-num">1</div>
                <div className="stat-label">Flagship</div>
              </div>
            </div>
          </div>
          <div className="about-visual">
            <div className="visual-inner">
              <div className="hanger-icon">⌒</div>
              <div className="visual-text">DRIP HARD<br/>DRESS SHARP</div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="collections" ref={addToRefs}>
        <div className="collection-header">
          <span className="section-label">Collections</span>
          <h2 className="section-title">Crafted in <span>drops</span>.</h2>
        </div>
        <div className="collection-grid">
          <Link href="/shop" className="collection-card card-1" style={{ textDecoration: 'none' }}>
            <div className="card-bg"></div>
            <div className="card-content">
              <div className="card-tag">Signature</div>
              <div className="card-title">Acid Wash</div>
              <div className="card-desc">Bleached. Rugged. Unapologetic.</div>
              <div className="card-link">Explore →</div>
            </div>
          </Link>
          <Link href="/shop" className="collection-card card-2" style={{ textDecoration: 'none' }}>
            <div className="card-bg"></div>
            <div className="card-content">
              <div className="card-tag">New Year</div>
              <div className="card-title">&apos;26 Edit</div>
              <div className="card-desc">A fresh start, sharply dressed.</div>
              <div className="card-link">Explore →</div>
            </div>
          </Link>
          <Link href="/shop" className="collection-card card-3" style={{ textDecoration: 'none' }}>
            <div className="card-bg"></div>
            <div className="card-content">
              <div className="card-tag">Street</div>
              <div className="card-title">Everyday Drip</div>
              <div className="card-desc">Built for the daily flex.</div>
              <div className="card-link">Explore →</div>
            </div>
          </Link>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" ref={addToRefs}>
        <div style={{ textAlign: 'center' }}>
          <span className="section-label">@hunkxapparel</span>
          <h2 className="section-title">Straight from the <span>feed</span>.</h2>
        </div>
        <div className="gallery-grid">
          <div className="gallery-item gi-1"><span className="gi-label">Denim</span></div>
          <div className="gallery-item gi-2"><span className="gi-label">Street</span></div>
          <div className="gallery-item gi-3"><span className="gi-label">Gold</span></div>
          <div className="gallery-item gi-4"><span className="gi-label">Skull</span></div>
          <div className="gallery-item gi-5"><span className="gi-label">Drop</span></div>
          <div className="gallery-item gi-6"><span className="gi-label">Wash</span></div>
          <div className="gallery-item gi-7"><span className="gi-label">2026</span></div>
          <div className="gallery-item gi-8"><span className="gi-label">Fit</span></div>
        </div>
        <div className="gallery-cta">
          <a href="https://instagram.com/hunkxapparel" target="_blank" rel="noopener noreferrer" className="btn-secondary">Follow @hunkxapparel</a>
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
            <a href="https://maps.app.goo.gl/rHiqQWMH3msZEr2b8" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: '10px' }}>Get Directions</a>
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
