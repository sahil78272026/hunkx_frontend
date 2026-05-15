"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Manually remove any scroll locks applied by Razorpay's modal just in case it didn't clean up
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    
    // Read the pending order we saved in checkout
    const savedOrder = localStorage.getItem("hunkx_pending_order");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
      // Clear the actual cart since order is placed
      clearCart();
    }
  }, []);

  if (!order) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Loading...</div>;

  // Build the WhatsApp message
  const itemsText = order.items.map(i => `${i.quantity}x ${i.name} (${i.size})`).join('%0A');
  const message = `Hi HUNKX! I just placed a test order on the website.%0A%0A*Order ID:* ${order.id}%0A*Name:* ${order.customer.name}%0A*Amount:* ₹${order.total}%0A%0A*Items:*%0A${itemsText}%0A%0APlease confirm my order!`;
  
  // Using the wa.me format
  const whatsappUrl = `https://wa.me/917669933665?text=${message}`;

  return (
    <main style={{ paddingTop: '150px', minHeight: '100vh', paddingBottom: '60px', textAlign: 'center' }}>
      <section style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--black-soft)', padding: '50px', border: '1px solid var(--gold)' }}>
        <div style={{ fontSize: '4rem', color: 'var(--gold-bright)', marginBottom: '20px' }}>✓</div>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Order <span>Confirmed</span></h1>
        
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Order ID: <strong>{order.id}</strong></p>
        <p style={{ color: 'rgba(245,236,214,0.7)', marginBottom: '40px' }}>Your simulated payment was successful.</p>

        <div style={{ padding: '25px', border: '1px dashed var(--gold)', marginBottom: '40px', textAlign: 'left', background: 'var(--black)' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '15px' }}>Next Step (The WhatsApp Magic)</h3>
          <p style={{ fontSize: '0.95rem', color: 'rgba(245,236,214,0.8)', lineHeight: '1.6', marginBottom: '20px' }}>
            Click the button below to automatically send your order details directly to the store owner's WhatsApp. This is how we skip the complex backend integration for the MVP!
          </p>
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary" 
            style={{ display: 'block', textAlign: 'center', background: '#25D366', color: 'black', borderColor: '#25D366', fontWeight: 'bold' }}
          >
            Send Order to WhatsApp ↗
          </a>
        </div>

        <Link href="/shop" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', padding: '10px' }}>
          ← Continue Shopping
        </Link>
      </section>
    </main>
  );
}
