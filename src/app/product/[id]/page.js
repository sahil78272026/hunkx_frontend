"use client";
import { useState, useEffect, use } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/v1/products/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center', color: 'var(--gold)' }}>Loading Product...</div>;
  if (!product) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, selectedSize, 1);
    router.push('/cart');
  };

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '60px', paddingLeft: '5%', paddingRight: '5%' }}>
      <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', marginBottom: '30px', fontSize: '1rem', fontFamily: 'Cinzel, serif' }}>
        ← Back
      </button>
      <section className="product-detail-grid">
        
        {/* Image side */}
        <div style={{ aspectRatio: '3/4', background: `url(${product.images[0]}) center/cover`, border: '1px solid var(--gold)' }}>
        </div>

        {/* Info side */}
        <div>
          <span className="section-label">{product.category}</span>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: '15px' }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--gold-bright)', marginBottom: '30px' }}>₹{product.price}</p>
          <p style={{ color: 'rgba(245,236,214,0.7)', marginBottom: '40px', lineHeight: '1.8' }}>{product.description}</p>
          
          <div style={{ marginBottom: '30px' }}>
            <div className="section-label" style={{ marginBottom: '10px' }}>Select Size</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '10px 20px',
                    background: selectedSize === size ? 'var(--gold)' : 'transparent',
                    color: selectedSize === size ? 'var(--black)' : 'var(--gold)',
                    border: '1px solid var(--gold)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleAddToCart} className="btn-primary" style={{ width: '100%', marginBottom: '15px' }}>
            Add to Cart
          </button>
          
          <Link href="/shop" style={{ display: 'block', textAlign: 'center', color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Shop
          </Link>
        </div>

      </section>
    </main>
  );
}
