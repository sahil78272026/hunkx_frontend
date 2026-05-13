"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, isLoaded } = useCart();
  const router = useRouter();

  if (!isLoaded) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Loading cart...</div>;

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '60px' }}>
      <section style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="section-label">Your Bag</span>
          <h1 className="section-title">Review <span>Order</span></h1>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Your cart is empty.</p>
            <Link href="/shop" className="btn-primary">Go to Shop</Link>
          </div>
        ) : (
          <div>
            {/* Cart Items List */}
            <div style={{ borderTop: '1px solid rgba(212,162,58,0.2)' }}>
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${item.size}-${idx}`} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '20px 0', 
                  borderBottom: '1px solid rgba(212,162,58,0.2)',
                  gap: '20px'
                }}>
                  <div style={{ width: '80px', height: '100px', background: `url(${item.images[0]}) center/cover` }}></div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3>
                    <p style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>Size: {item.size} | ₹{item.price}</p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', width: '30px', height: '30px', cursor: 'pointer' }}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', width: '30px', height: '30px', cursor: 'pointer' }}>+</button>
                  </div>

                  <div style={{ fontWeight: 'bold', width: '80px', textAlign: 'right' }}>
                    ₹{item.price * item.quantity}
                  </div>

                  <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', marginLeft: '10px' }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '300px', background: 'var(--black-soft)', padding: '30px', border: '1px solid var(--gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'rgba(245,236,214,0.5)' }}>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderTop: '1px solid rgba(212,162,58,0.2)', paddingTop: '15px', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--gold-bright)' }}>
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
                <button 
                  onClick={() => router.push('/checkout')} 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        )}
      </section>
    </main>
  );
}
