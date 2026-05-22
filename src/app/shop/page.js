"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/v1/products/`);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px', paddingLeft: '5%', paddingRight: '5%' }}>
      <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', marginBottom: '10px', fontSize: '1rem', fontFamily: 'Cinzel, serif' }}>
        ← Back
      </button>
      <section style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-label">Catalog</span>
          <h1 className="section-title">All <span>Drops</span></h1>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: '50px', fontSize: '1.2rem', color: 'var(--gold)' }}>Loading Collection...</div>
        ) : (
          <div className="collection-grid">
            {products.map(product => (
              <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
                <div className="collection-card card-1" style={{ border: '1px solid rgba(212,162,58,0.2)' }}>
                  <div className="card-bg" style={{ 
                    background: `linear-gradient(180deg, transparent 40%, rgba(10,8,5,0.95) 100%), url(${product.images[0]}) center/cover`
                  }}></div>
                  <div className="card-content">
                    <div className="card-tag">{product.category}</div>
                    <div className="card-title" style={{ fontSize: '1.4rem' }}>{product.name}</div>
                    <div className="card-desc" style={{ color: 'var(--gold)' }}>₹{product.price}</div>
                    <div className="card-link">View Details →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
