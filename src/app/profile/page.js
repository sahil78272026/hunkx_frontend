"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, session, loading: authLoading, openAuthModal } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [requestingRefund, setRequestingRefund] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal();
      router.push("/");
    }
  }, [user, authLoading, router, openAuthModal]);

  useEffect(() => {
    if (user && session) {
      const fetchOrders = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const res = await fetch(`${API_URL}/api/v1/orders/my-orders`, {
            headers: {
              "Authorization": `Bearer ${session.access_token}`
            }
          });
          if (!res.ok) throw new Error("Failed to load orders");
          const data = await res.json();
          setOrders(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user, session]);

  const handleRequestRefund = async (e) => {
    e.preventDefault();
    if (!refundReason.trim() || !selectedOrderId) return;
    
    setRequestingRefund(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/v1/orders/${selectedOrderId}/request-refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: refundReason })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to request refund");
      
      // Update orders list
      setOrders(orders.map(o => o.id === selectedOrderId ? data : o));
      setShowRefundModal(false);
      setRefundReason("");
      setSelectedOrderId(null);
      alert("Refund request submitted successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setRequestingRefund(false);
    }
  };

  if (authLoading || (!user && !authLoading)) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '60px', paddingLeft: '5%', paddingRight: '5%' }}>
      <section style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          My <span>Profile</span>
        </h1>
        
        <div style={{ background: 'var(--black-soft)', padding: '30px', border: '1px solid var(--gold)', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '10px' }}>Account Details</h2>
          <p style={{ color: 'var(--cream)', fontSize: '1.1rem' }}><strong>Name:</strong> {user.user_metadata?.full_name || 'N/A'}</p>
          <p style={{ color: 'var(--cream)', fontSize: '1.1rem' }}><strong>Email:</strong> {user.email}</p>
        </div>

        <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '20px' }}>Order History</h2>
        
        {loadingOrders ? (
          <p>Loading your orders...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : orders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'var(--pitch-black)', padding: '20px', border: '1px solid rgba(212,162,58,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(212,162,58,0.3)', paddingBottom: '10px', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--gold)' }}>Order #{order.id.substring(0, 8).toUpperCase()}</span>
                  <span style={{ fontWeight: 'bold' }}>{order.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '15px', color: '#aaa' }}>Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.quantity}x {item.name} (Size: {item.size})</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(212,162,58,0.3)' }}>
                  {!order.refund_rejection_reason && ['PAID', 'PACKED', 'SHIPPED', 'DELIVERED'].includes(order.status) ? (
                    <button 
                      onClick={() => { setSelectedOrderId(order.id); setShowRefundModal(true); }}
                      style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px', fontSize: '0.9rem' }}
                    >
                      Request Cancellation / Refund
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <span style={{ fontWeight: 'bold', color: 'var(--gold-bright)' }}>Total: ₹{order.total_amount}</span>
                </div>
                
                {order.status === "REFUND_REQUESTED" && (
                  <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,152,0,0.1)', border: '1px dashed #ff9800' }}>
                    <p style={{ color: '#ff9800', fontSize: '0.9rem', margin: 0 }}>Refund requested. Reason: {order.refund_reason}</p>
                  </div>
                )}
                
                {order.refund_rejection_reason && (
                  <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,0,0,0.1)', border: '1px dashed #ff4444' }}>
                    <p style={{ color: '#ff4444', fontSize: '0.9rem', margin: 0 }}>Refund request declined by Admin. Reason: {order.refund_rejection_reason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Request Refund Modal */}
      {showRefundModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'var(--black-soft)', padding: '30px', border: '1px solid var(--gold)',
            borderRadius: '8px', maxWidth: '500px', width: '100%', position: 'relative'
          }}>
            <button 
              onClick={() => { setShowRefundModal(false); setSelectedOrderId(null); }}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ✕
            </button>
            <h2 style={{ fontFamily: 'Cinzel', color: 'var(--gold-bright)', marginBottom: '20px', textAlign: 'center' }}>Request Refund</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
              Please let us know why you want to cancel or return this order. Our admin will review and process your request.
            </p>
            
            <form onSubmit={handleRequestRefund}>
              <textarea 
                required 
                rows="4" 
                placeholder="Enter your reason here..." 
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                style={{ width: '100%', padding: '15px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', outline: 'none', resize: 'vertical', marginBottom: '20px', fontFamily: 'Inter' }}
              />
              
              <button disabled={requestingRefund} type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', opacity: requestingRefund ? 0.7 : 1 }}>
                {requestingRefund ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
