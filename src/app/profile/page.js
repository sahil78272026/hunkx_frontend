"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
  const { user, session, loading: authLoading, openAuthModal } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: "", mobile: "", street_address: "", city: "", state: "", pincode: "", is_default: false
  });
  const [addingAddress, setAddingAddress] = useState(false);

  // Refund State
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (user && session) {
      const fetchOrdersAndAddresses = async () => {
        try {
          const [ordersRes, addressesRes] = await Promise.all([
            fetch(`${API_URL}/api/v1/orders/my-orders`, { headers: { "Authorization": `Bearer ${session.access_token}` } }),
            fetch(`${API_URL}/api/v1/addresses/`, { headers: { "Authorization": `Bearer ${session.access_token}` } })
          ]);
          
          if (ordersRes.ok) {
            setOrders(await ordersRes.json());
          } else {
            throw new Error("Failed to load orders");
          }
          
          if (addressesRes.ok) {
            setAddresses(await addressesRes.json());
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingOrders(false);
          setLoadingAddresses(false);
        }
      };
      fetchOrdersAndAddresses();
    }
  }, [user, session]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddingAddress(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/addresses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}` },
        body: JSON.stringify(newAddress)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to add address");
      
      if (data.is_default) {
        setAddresses([data, ...addresses.map(a => ({ ...a, is_default: false }))]);
      } else {
        setAddresses([data, ...addresses]);
      }
      setShowAddressModal(false);
      setNewAddress({ full_name: "", mobile: "", street_address: "", city: "", state: "", pincode: "", is_default: false });
      showToast("Address saved successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/addresses/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });
      if (!res.ok) throw new Error("Failed to delete address");
      // Refetch addresses to get updated defaults
      const refreshRes = await fetch(`${API_URL}/api/v1/addresses/`, { headers: { "Authorization": `Bearer ${session.access_token}` } });
      if (refreshRes.ok) {
        setAddresses(await refreshRes.json());
      }
      showToast("Address deleted.", "info");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleRequestRefund = async (e) => {
    e.preventDefault();
    if (!refundReason.trim() || !selectedOrderId) return;
    
    setRequestingRefund(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/orders/${selectedOrderId}/request-refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}` },
        body: JSON.stringify({ reason: refundReason })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to request refund");
      
      setOrders(orders.map(o => o.id === selectedOrderId ? data : o));
      setShowRefundModal(false);
      setRefundReason("");
      setSelectedOrderId(null);
      showToast("Refund request submitted successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setRequestingRefund(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['CREATED', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED'];
    return steps.indexOf(status);
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <main style={{ paddingTop: '120px', minHeight: '100vh', padding: '120px 5% 60px 5%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="skeleton skeleton-title" style={{ margin: '0 auto 40px', width: '300px', height: '40px' }}></div>
          <div className="skeleton skeleton-box" style={{ marginBottom: '40px', height: '120px' }}></div>
          <div className="skeleton skeleton-box" style={{ height: '300px' }}></div>
        </div>
      </main>
    );
  }

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

        {/* Addresses Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', margin: 0 }}>Saved Addresses</h2>
            <button onClick={() => setShowAddressModal(true)} className="btn-primary" style={{ padding: '8px 15px', fontSize: '0.9rem' }}>+ Add Address</button>
          </div>
          
          {loadingAddresses ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="skeleton skeleton-box" style={{ height: '180px' }}></div>
              <div className="skeleton skeleton-box" style={{ height: '180px' }}></div>
            </div>
          ) : addresses.length === 0 ? (
            <p>No saved addresses yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {addresses.map(addr => (
                <div key={addr.id} style={{ background: 'var(--pitch-black)', padding: '20px', border: addr.is_default ? '1px solid var(--gold)' : '1px solid rgba(212,162,58,0.3)', position: 'relative' }}>
                  {addr.is_default && <span style={{ position: 'absolute', top: '-10px', right: '10px', background: 'var(--gold)', color: 'black', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Default</span>}
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'white' }}>{addr.full_name}</h3>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#ccc' }}>{addr.street_address}</p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#ccc' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#ccc' }}>Mobile: {addr.mobile}</p>
                  <button onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '0.8rem' }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '20px' }}>Order History</h2>
        
        {loadingOrders ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton skeleton-box" style={{ height: '250px' }}></div>
            <div className="skeleton skeleton-box" style={{ height: '250px' }}></div>
          </div>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : orders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'var(--pitch-black)', padding: '20px', border: '1px solid rgba(212,162,58,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(212,162,58,0.3)', paddingBottom: '10px', marginBottom: '15px' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>Order #{order.id.substring(0, 8).toUpperCase()}</span>
                  <span style={{ fontWeight: 'bold', color: order.status === 'DELIVERED' ? '#4caf50' : 'white' }}>{order.status}</span>
                </div>
                
                {/* Visual Timeline */}
                {['PAID', 'PACKED', 'SHIPPED', 'DELIVERED'].includes(order.status) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', height: '2px', background: '#333', zIndex: 1 }}></div>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', width: `${(getStatusStep(order.status) - 1) * 33.33}%`, height: '2px', background: 'var(--gold)', zIndex: 2, transition: 'width 0.5s ease' }}></div>
                    
                    {['PAID', 'PACKED', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
                      const isActive = getStatusStep(order.status) >= idx + 1;
                      return (
                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isActive ? 'var(--gold)' : '#333', border: '2px solid var(--pitch-black)' }}></div>
                          <span style={{ fontSize: '0.75rem', marginTop: '5px', color: isActive ? 'var(--gold)' : '#666' }}>{step}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

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

      {/* Add Address Modal */}
      {showAddressModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div className="glass-modal" style={{
            padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <button 
              onClick={() => setShowAddressModal(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ✕
            </button>
            <h2 style={{ fontFamily: 'Cinzel', color: 'var(--gold-bright)', marginBottom: '20px', textAlign: 'center' }}>Add New Address</h2>
            
            <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required placeholder="Full Name" value={newAddress.full_name} onChange={e => setNewAddress({...newAddress, full_name: e.target.value})} style={{ padding: '12px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', fontFamily: 'Inter' }} />
              <input required placeholder="Mobile Number" value={newAddress.mobile} onChange={e => setNewAddress({...newAddress, mobile: e.target.value})} style={{ padding: '12px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', fontFamily: 'Inter' }} />
              <input required placeholder="Street Address" value={newAddress.street_address} onChange={e => setNewAddress({...newAddress, street_address: e.target.value})} style={{ padding: '12px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', fontFamily: 'Inter' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input required placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} style={{ flex: 1, padding: '12px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', fontFamily: 'Inter' }} />
                <input required placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} style={{ flex: 1, padding: '12px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', fontFamily: 'Inter' }} />
              </div>
              <input required placeholder="Pincode (6 digits)" maxLength={6} value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} style={{ padding: '12px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', fontFamily: 'Inter' }} />
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#ccc', fontFamily: 'Inter' }}>
                <input type="checkbox" checked={newAddress.is_default} onChange={e => setNewAddress({...newAddress, is_default: e.target.checked})} />
                Set as Default Address
              </label>

              <button disabled={addingAddress} type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: '10px', opacity: addingAddress ? 0.7 : 1 }}>
                {addingAddress ? "Saving..." : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Request Refund Modal */}
      {showRefundModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div className="glass-modal" style={{
            padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '100%', position: 'relative'
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
