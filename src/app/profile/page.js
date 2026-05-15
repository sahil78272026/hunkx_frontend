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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(212,162,58,0.3)' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--gold-bright)' }}>Total: ₹{order.total_amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
