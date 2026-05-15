"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError("");
    setOrderStatus(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/v1/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error("Order not found or invalid ID.");
      }

      const data = await response.json();
      setOrderStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '60px', paddingLeft: '5%', paddingRight: '5%' }}>
      <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', marginBottom: '30px', fontSize: '1rem', fontFamily: 'Cinzel, serif' }}>
        ← Back
      </button>
      <section style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 className="section-title" style={{ marginBottom: '40px' }}>Track <span>Order</span></h1>
        
        <form onSubmit={handleTrack} style={{ display: 'grid', gap: '20px' }}>
          <div>
            <input 
              required 
              type="text" 
              placeholder="Enter your Order ID (e.g. 5e3f2a...)" 
              value={orderId}
              onChange={e => setOrderId(e.target.value)} 
              style={{ width: '100%', padding: '15px', background: 'var(--black-soft)', border: '1px solid rgba(212,162,58,0.3)', color: 'white', fontFamily: 'Inter', textAlign: 'center', fontSize: '1.1rem' }} 
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '15px' }}>
            {loading ? "Tracking..." : "Track Status"}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '30px', color: '#ff6b6b', padding: '15px', border: '1px solid #ff6b6b' }}>
            {error}
          </div>
        )}

        {orderStatus && (
          <div style={{ marginTop: '40px', padding: '30px', border: '1px solid var(--gold)', background: 'var(--black-soft)' }}>
            <h3 style={{ color: 'var(--gold-bright)', marginBottom: '20px', fontFamily: 'Cinzel', fontSize: '1.5rem' }}>Status: {orderStatus.status}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'rgba(255,255,255,0.8)' }}>
              <p><strong>Order ID:</strong> {orderStatus.id}</p>
              <p><strong>Total Amount:</strong> ₹{orderStatus.total_amount}</p>
              {orderStatus.status === "CREATED" && (
                <p style={{ color: '#ffcc00', marginTop: '10px' }}>Your order is awaiting payment confirmation.</p>
              )}
              {orderStatus.status === "PAID" && (
                <p style={{ color: '#4caf50', marginTop: '10px' }}>Payment successful! Your order is being processed.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
