"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const { user, session, loading: authLoading, openAuthModal } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom confirmation modal state
  const [confirmPopup, setConfirmPopup] = useState({ isOpen: false, orderId: null, newStatus: null, currentStatus: null });
  
  // Order history details modal state
  const [orderDetailsPopup, setOrderDetailsPopup] = useState({ isOpen: false, order: null });

  // Products state
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [adminProducts, setAdminProducts] = useState([]);
  const [newProductPopup, setNewProductPopup] = useState(false);
  const [editProductPopup, setEditProductPopup] = useState({ isOpen: false, product: null });
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const initialProductForm = { name: '', category: '', price: '', description: '', sizes: 'S, M, L, XL', images: '' };
  const [newProductForm, setNewProductForm] = useState(initialProductForm);

  // Escape key listener for closing modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (orderDetailsPopup.isOpen) {
          setOrderDetailsPopup({ isOpen: false, order: null });
        }
        if (confirmPopup.isOpen) {
          setConfirmPopup({ isOpen: false, orderId: null, newStatus: null, currentStatus: null });
        }
        if (newProductPopup) setNewProductPopup(false);
        if (editProductPopup.isOpen) setEditProductPopup({ isOpen: false, product: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderDetailsPopup.isOpen, confirmPopup.isOpen, newProductPopup, editProductPopup.isOpen]);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal();
      router.push("/");
    }
  }, [user, authLoading, router, openAuthModal]);

  useEffect(() => {
    if (user && session) {
      fetchAdminData();
    }
  }, [user, session]);

  const fetchAdminData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const statsRes = await fetch(`${API_URL}/api/v1/admin/stats`, {
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });
      if (!statsRes.ok) throw new Error("Failed to load stats. Are you an admin?");
      const statsData = await statsRes.json();
      setStats(statsData);

      const ordersRes = await fetch(`${API_URL}/api/v1/admin/orders`, {
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });
      if (!ordersRes.ok) throw new Error("Failed to load orders.");
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      const productsRes = await fetch(`${API_URL}/api/v1/products/`);
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setAdminProducts(productsData);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/v1/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      // Refresh data
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = (orderId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return;
    setConfirmPopup({ isOpen: true, orderId, newStatus, currentStatus });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let imageUrl = newProductForm.images; // fallback if typed manually

      // Upload file to Supabase if a file was selected
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data, error } = await supabase.storage.from('hunkx_storage_sb').upload(`public/${fileName}`, uploadFile);
        
        if (error) throw new Error("Image Upload Failed: " + error.message);
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('hunkx_storage_sb').getPublicUrl(`public/${fileName}`);
        imageUrl = publicUrlData.publicUrl;
      } else if (!imageUrl) {
        throw new Error("Please select an image file.");
      }

      const payload = {
        ...newProductForm,
        price: parseInt(newProductForm.price),
        sizes: newProductForm.sizes.split(',').map(s => s.trim()),
        images: [imageUrl],
        stock: 100,
        active: true
      };
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/v1/products/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to create product");
      
      setNewProductPopup(false);
      setNewProductForm(initialProductForm);
      setUploadFile(null);
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let imageUrl = newProductForm.images;

      // Handle new image upload if selected
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data, error } = await supabase.storage.from('hunkx_storage_sb').upload(`public/${fileName}`, uploadFile);
        if (error) throw new Error("Image Upload Failed: " + error.message);
        const { data: publicUrlData } = supabase.storage.from('hunkx_storage_sb').getPublicUrl(`public/${fileName}`);
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        name: newProductForm.name,
        category: newProductForm.category,
        price: parseInt(newProductForm.price),
        description: newProductForm.description,
        sizes: typeof newProductForm.sizes === 'string' ? newProductForm.sizes.split(',').map(s => s.trim()) : newProductForm.sizes,
        images: [imageUrl],
      };
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/v1/products/${editProductPopup.product.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to update product");
      
      setEditProductPopup({ isOpen: false, product: null });
      setNewProductForm(initialProductForm);
      setUploadFile(null);
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/v1/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });
      
      if (!res.ok) throw new Error("Failed to delete product");
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || (!user && !authLoading)) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Loading admin dashboard...</div>;

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '60px', paddingLeft: '5%', paddingRight: '5%' }}>
      <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          Control <span>Room</span>
        </h1>

        {error ? (
          <div style={{ background: 'rgba(255,0,0,0.1)', padding: '20px', border: '1px solid red', color: 'red', textAlign: 'center' }}>
            {error}
          </div>
        ) : loadingData ? (
          <p style={{ textAlign: 'center' }}>Loading highly classified data...</p>
        ) : (
          <>
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: 'var(--black-soft)', padding: '30px', border: '1px solid var(--gold)', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--gold)', marginBottom: '10px' }}>Total Revenue</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{stats?.total_revenue || 0}</p>
              </div>
              <div style={{ background: 'var(--black-soft)', padding: '30px', border: '1px solid var(--gold)', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--gold)', marginBottom: '10px' }}>Total Orders</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.total_orders || 0}</p>
              </div>
              <div style={{ background: 'var(--black-soft)', padding: '30px', border: '1px solid var(--gold)', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--gold)', marginBottom: '10px' }}>Pending Orders</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.pending_orders || 0}</p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(212,162,58,0.3)', marginBottom: '30px' }}>
              <button 
                onClick={() => setActiveTab('orders')}
                style={{ 
                  background: 'transparent', border: 'none', padding: '10px 20px', cursor: 'pointer',
                  color: activeTab === 'orders' ? 'var(--gold-bright)' : '#888',
                  borderBottom: activeTab === 'orders' ? '2px solid var(--gold)' : '2px solid transparent',
                  fontFamily: 'Cinzel, serif', fontSize: '1.2rem'
                }}
              >
                Platform Orders
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                style={{ 
                  background: 'transparent', border: 'none', padding: '10px 20px', cursor: 'pointer',
                  color: activeTab === 'products' ? 'var(--gold-bright)' : '#888',
                  borderBottom: activeTab === 'products' ? '2px solid var(--gold)' : '2px solid transparent',
                  fontFamily: 'Cinzel, serif', fontSize: '1.2rem'
                }}
              >
                Product Management
              </button>
            </div>

            {activeTab === 'orders' ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ background: 'var(--black-soft)', borderBottom: '1px solid var(--gold)' }}>
                      <th style={{ padding: '15px' }}>Order ID</th>
                      <th style={{ padding: '15px' }}>Date</th>
                      <th style={{ padding: '15px' }}>Amount</th>
                      <th style={{ padding: '15px' }}>Items</th>
                      <th style={{ padding: '15px' }}>Status</th>
                      <th style={{ padding: '15px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid rgba(212,162,58,0.2)' }}>
                        <td style={{ padding: '15px' }}>
                          <button 
                            onClick={() => setOrderDetailsPopup({ isOpen: true, order })}
                            style={{ 
                              background: 'transparent', border: 'none', color: 'var(--gold-bright)', 
                              textDecoration: 'underline', cursor: 'pointer', fontFamily: 'Inter', fontSize: '1rem', padding: 0
                            }}
                          >
                            {order.id.substring(0, 8)}
                          </button>
                        </td>
                        <td style={{ padding: '15px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '15px' }}>₹{order.total_amount}</td>
                        <td style={{ padding: '15px' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.85rem', color: '#aaa' }}>
                              {item.quantity}x {item.name} ({item.size})
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ 
                            padding: '5px 10px', 
                            background: order.status === 'DELIVERED' ? 'rgba(0,255,0,0.1)' : 'rgba(212,162,58,0.1)',
                            color: order.status === 'DELIVERED' ? '#0f0' : 'var(--gold)',
                            borderRadius: '4px',
                            fontSize: '0.85rem'
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value, order.status)}
                            style={{ background: 'var(--pitch-black)', color: 'white', border: '1px solid var(--gold)', padding: '5px', outline: 'none' }}
                          >
                            {['CREATED', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED'].map((statusOption, idx) => {
                              const statuses = ['CREATED', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED'];
                              const currentIndex = statuses.indexOf(order.status);
                              const optionIndex = statuses.indexOf(statusOption);
                              
                              const isDisabled = optionIndex < currentIndex;
                              
                              return (
                                <option 
                                  key={statusOption} 
                                  value={statusOption} 
                                  disabled={isDisabled} 
                                  style={{ background: '#0a0805', color: '#fff' }}
                                >
                                  {statusOption}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      setNewProductForm(initialProductForm);
                      setUploadFile(null);
                      setNewProductPopup(true);
                    }}
                    style={{ padding: '10px 20px', border: 'none', cursor: 'pointer' }}
                  >
                    + Add New Product
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {adminProducts.map(prod => (
                    <div key={prod.id} style={{ border: '1px solid rgba(212,162,58,0.3)', padding: '15px', background: 'var(--black-soft)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '25px', right: '25px', display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => {
                            setNewProductForm({
                              name: prod.name, category: prod.category, price: prod.price, 
                              description: prod.description || '', sizes: prod.sizes.join(', '), images: prod.images[0]
                            });
                            setUploadFile(null);
                            setEditProductPopup({ isOpen: true, product: prod });
                          }}
                          style={{ background: 'var(--black)', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                        >Edit</button>
                        <button 
                          onClick={() => handleDeleteProduct(prod.id)}
                          style={{ background: 'var(--black)', border: '1px solid red', color: 'red', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                        >Delete</button>
                      </div>
                      
                      <div style={{ height: '200px', background: `url(${prod.images[0]}) center/cover`, marginBottom: '15px', border: '1px solid var(--gold)' }}></div>
                      <h4 style={{ color: 'var(--cream)', fontSize: '1.1rem', marginBottom: '5px', paddingRight: '100px' }}>{prod.name}</h4>
                      <p style={{ color: 'var(--gold)', marginBottom: '5px' }}>₹{prod.price}</p>
                      <p style={{ color: '#888', fontSize: '0.9rem' }}>Category: {prod.category}</p>
                      <p style={{ color: '#888', fontSize: '0.9rem' }}>Sizes: {prod.sizes.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Beautiful Animated Modal */}
      {confirmPopup.isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'adminFadeIn 0.2s ease-out'
        }}>
          <style>{`
            @keyframes adminFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes adminSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
          <div style={{
            background: 'var(--pitch-black)', border: '1px solid var(--gold)',
            padding: '40px', maxWidth: '500px', width: '90%', textAlign: 'center',
            animation: 'adminSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '20px', fontSize: '1.8rem' }}>Confirm Status</h2>
            <p style={{ color: 'var(--cream)', marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.5' }}>
              Are you sure you want to move this order to <strong style={{ color: 'var(--gold-bright)' }}>{confirmPopup.newStatus}</strong>?
              <br/><br/>
              <span style={{ fontSize: '0.9rem', color: '#ff4444', display: 'inline-block', padding: '10px', background: 'rgba(255,0,0,0.05)', border: '1px dashed rgba(255,0,0,0.3)' }}>
                ⚠ This action cannot be reverted.
              </span>
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button 
                onClick={() => setConfirmPopup({ isOpen: false, orderId: null, newStatus: null, currentStatus: null })}
                style={{ background: 'transparent', border: '1px solid rgba(212,162,58,0.3)', color: 'var(--cream)', padding: '12px 30px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.target.style.background = 'rgba(212,162,58,0.1)'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  updateOrderStatus(confirmPopup.orderId, confirmPopup.newStatus);
                  setConfirmPopup({ isOpen: false, orderId: null, newStatus: null, currentStatus: null });
                }}
                className="btn-primary"
                style={{ padding: '12px 30px', border: 'none', cursor: 'pointer' }}
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details & History Modal */}
      {orderDetailsPopup.isOpen && orderDetailsPopup.order && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'adminFadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'var(--pitch-black)', border: '1px solid var(--gold)',
            padding: '30px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
            animation: 'adminSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative'
          }}>
            <button 
              onClick={() => setOrderDetailsPopup({ isOpen: false, order: null })}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '1.5rem' }}
            >
              ✕
            </button>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '10px', fontSize: '1.5rem' }}>Order Details</h2>
            <p style={{ color: '#aaa', marginBottom: '20px' }}>ID: {orderDetailsPopup.order.id}</p>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--cream)', marginBottom: '10px', fontSize: '1.1rem' }}>Customer Info</h3>
              <p style={{ color: '#ccc', margin: '5px 0' }}><strong>Name:</strong> {orderDetailsPopup.order.customer_name || 'N/A'}</p>
              <p style={{ color: '#ccc', margin: '5px 0' }}><strong>Email:</strong> {orderDetailsPopup.order.customer_email || 'N/A'}</p>
              <p style={{ color: '#ccc', margin: '5px 0' }}><strong>Mobile:</strong> {orderDetailsPopup.order.customer_mobile || 'N/A'}</p>
              <p style={{ color: '#ccc', margin: '5px 0' }}><strong>Address:</strong> {orderDetailsPopup.order.customer_address || 'N/A'}, {orderDetailsPopup.order.customer_pincode}</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--cream)', marginBottom: '15px', fontSize: '1.1rem' }}>Status History Timeline</h3>
              <div style={{ borderLeft: '2px solid rgba(212,162,58,0.3)', paddingLeft: '20px', marginLeft: '10px' }}>
                {(() => {
                  let history = orderDetailsPopup.order.status_history || [];
                  // Ensure CREATED is always the first event if it's missing from the history array
                  if (!history.some(h => h.status === 'CREATED')) {
                    history = [{ status: 'CREATED', timestamp: orderDetailsPopup.order.created_at }, ...history];
                  }
                  
                  return history.map((historyItem, idx) => (
                    <div key={idx} style={{ position: 'relative', marginBottom: '15px' }}>
                      <div style={{ 
                        position: 'absolute', left: '-26px', top: '4px', width: '10px', height: '10px', 
                        borderRadius: '50%', background: 'var(--gold)', border: '2px solid var(--pitch-black)' 
                      }}></div>
                      <strong style={{ color: 'var(--gold-bright)' }}>{historyItem.status}</strong>
                      <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>
                        {new Date(historyItem.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* New Product Modal */}
      {(newProductPopup || editProductPopup.isOpen) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'adminFadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'var(--pitch-black)', border: '1px solid var(--gold)',
            padding: '30px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto',
            animation: 'adminSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative'
          }}>
            <button 
              onClick={() => {
                setNewProductPopup(false);
                setEditProductPopup({isOpen: false, product: null});
              }}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '1.5rem' }}
            >
              ✕
            </button>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '20px', fontSize: '1.5rem' }}>
              {editProductPopup.isOpen ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={editProductPopup.isOpen ? handleUpdateProduct : handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--cream)', marginBottom: '5px' }}>Product Name</label>
                <input required type="text" value={newProductForm.name} onChange={e => setNewProductForm({...newProductForm, name: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--cream)', marginBottom: '5px' }}>Category (e.g. T-Shirt, Pant)</label>
                <input required type="text" value={newProductForm.category} onChange={e => setNewProductForm({...newProductForm, category: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--cream)', marginBottom: '5px' }}>Price (₹)</label>
                <input required type="number" value={newProductForm.price} onChange={e => setNewProductForm({...newProductForm, price: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--cream)', marginBottom: '5px' }}>Description</label>
                <textarea required rows="3" value={newProductForm.description} onChange={e => setNewProductForm({...newProductForm, description: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', outline: 'none', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--cream)', marginBottom: '5px' }}>Sizes (comma separated)</label>
                <input required type="text" value={newProductForm.sizes} onChange={e => setNewProductForm({...newProductForm, sizes: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--cream)', marginBottom: '5px' }}>Product Image</label>
                {editProductPopup.isOpen && newProductForm.images && (
                  <div style={{ marginBottom: '10px' }}>
                    <img src={newProductForm.images} alt="Current" style={{ width: '100px', border: '1px solid var(--gold)' }} />
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Current image. Upload a new one to replace.</div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setUploadFile(e.target.files[0])} 
                  required={!editProductPopup.isOpen && !newProductForm.images}
                  style={{ width: '100%', padding: '10px', background: '#0a0805', border: '1px solid rgba(212,162,58,0.5)', color: 'white', outline: 'none' }} 
                />
              </div>
              <button disabled={isUploading} type="submit" className="btn-primary" style={{ padding: '12px', border: 'none', cursor: isUploading ? 'not-allowed' : 'pointer', marginTop: '10px', fontSize: '1rem', opacity: isUploading ? 0.7 : 1 }}>
                {isUploading ? 'Uploading & Saving...' : (editProductPopup.isOpen ? 'Update Product' : 'Publish Product')}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
