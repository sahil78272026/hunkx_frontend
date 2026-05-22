"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { totalItems, isLoaded, clearCart } = useCart();
  const { user, openAuthModal, signOut, loading } = useAuth();
  const pathname = usePathname();

  return (
    <nav>
      <div className="logo"><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>HUNKX</Link></div>
      <ul className="nav-links">
        <li><Link href="/shop" className={pathname === '/shop' ? 'active' : ''}>Shop</Link></li>
        <li><Link href="/track" className={pathname === '/track' ? 'active' : ''}>Track Order</Link></li>
        <li><Link href="/#visit" className={pathname === '/#visit' ? 'active' : ''}>Visit</Link></li>
      </ul>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link href="/cart" style={{ color: 'var(--cream)', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
          Cart {isLoaded && totalItems > 0 && `(${totalItems})`}
        </Link>
        
        {!loading && (
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href="/profile" style={{ color: 'var(--gold)', fontSize: '0.9rem', textDecoration: 'none', cursor: 'pointer' }}>
                Hi, {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
              </Link>
              {user.email === 'sahilg045@gmail.com' && (
                <Link href="/admin" style={{ color: '#ff4444', fontSize: '0.9rem', textDecoration: 'none', cursor: 'pointer' }}>
                  Admin
                </Link>
              )}
              <button onClick={() => { clearCart(); signOut(); }} className="nav-cta" style={{ background: 'transparent', border: '1px solid var(--gold)', cursor: 'pointer', padding: '0.5rem 1rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={openAuthModal} className="nav-cta" style={{ background: 'transparent', border: '1px solid var(--gold)', cursor: 'pointer', padding: '0.5rem 1rem' }}>
              Login
            </button>
          )
        )}
      </div>
    </nav>
  );
}
