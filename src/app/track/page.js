"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Script from "next/script";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError("");
    setOrderStatus(null);
    setShowReviewModal(false);

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

  const handlePayNowClick = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    
    // Check if emails match
    // If orderStatus.customer_email is missing, we shouldn't crash, but block.
    if (!orderStatus.customer_email || user.email !== orderStatus.customer_email) {
      setError("This order does not belong to the currently logged in account. Please login with the correct email.");
      return;
    }

    setError(""); // clear any previous errors
    setShowReviewModal(true);
  };

  const initiateRazorpayPayment = () => {
    if (typeof window === "undefined" || !window.Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const options = {
        key: "rzp_test_SowtC06Uh2Hzs4", // Your live test key
        amount: orderStatus.total_amount * 100, 
        currency: "INR",
        name: "HUNKX",
        description: "Secure Order Payment",
        image: "https://placehold.co/150x150/0a0805/d4a23a?text=HUNKX",
        order_id: orderStatus.razorpay_order_id, 
        handler: function (response) {
          // Success! In checkout, we stored the order in localStorage, let's do the same
          const orderData = {
            id: orderStatus.id,
            total: orderStatus.total_amount,
            items: orderStatus.items || [],
            payment_id: response.razorpay_payment_id
          };
          localStorage.setItem("hunkx_pending_order", JSON.stringify(orderData));
          router.push("/success");
        },
        prefill: {
          email: orderStatus.customer_email || user.email,
        },
        theme: {
          color: "#d4a23a" 
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response){
        alert("Payment Failed! Reason: " + response.error.description);
      });
      
      setShowReviewModal(false); // Close modal when opening Razorpay
      rzp.open();
    } catch (err) {
      alert("Error processing payment: " + err.message);
    }
  };

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '60px', paddingLeft: '5%', paddingRight: '5%' }}>
      {/* Load Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

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
                <div style={{ marginTop: '20px', padding: '15px', borderTop: '1px solid rgba(212,162,58,0.3)' }}>
                  <p style={{ color: '#ffcc00', marginBottom: '15px' }}>Your order is awaiting payment confirmation.</p>
                  <button onClick={handlePayNowClick} className="btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                    Pay Now
                  </button>
                </div>
              )}
              
              {orderStatus.status === "PAID" && (
                <p style={{ color: '#4caf50', marginTop: '10px' }}>Payment successful! Your order is being processed.</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Review Modal */}
      {showReviewModal && orderStatus && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'var(--black-soft)', padding: '30px', border: '1px solid var(--gold)',
            borderRadius: '8px', maxWidth: '500px', width: '100%', position: 'relative'
          }}>
            <button 
              onClick={() => setShowReviewModal(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ✕
            </button>
            <h2 style={{ fontFamily: 'Cinzel', color: 'var(--gold-bright)', marginBottom: '20px', textAlign: 'center' }}>Review Order</h2>
            <div style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px', textAlign: 'left' }}>
              <p style={{ marginBottom: '10px' }}><strong>Order ID:</strong> <br/><span style={{ fontSize: '0.9rem', color: '#aaa' }}>{orderStatus.id}</span></p>
              <p style={{ marginBottom: '10px' }}><strong>Items:</strong></p>
              <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '20px' }}>
                {orderStatus.items?.map((item, i) => (
                  <li key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px', marginBottom: '5px' }}>
                    {item.quantity}x {item.name} (Size: {item.size}) - ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <div style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>
                <strong>Total to Pay: ₹{orderStatus.total_amount}</strong>
              </div>
            </div>
            
            <button onClick={initiateRazorpayPayment} className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.2rem' }}>
              Pay ₹{orderStatus.total_amount} Securely
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
