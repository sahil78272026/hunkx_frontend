"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems, isLoaded } = useCart();

  return (
    <nav>
      <div className="logo"><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>HUNKX</Link></div>
      <ul className="nav-links">
        <li><Link href="/shop">Shop</Link></li>
        <li><Link href="/#collections">Collections</Link></li>
        <li><Link href="/track">Track Order</Link></li>
      </ul>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link href="/cart" style={{ color: 'var(--cream)', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
          Cart {isLoaded && totalItems > 0 && `(${totalItems})`}
        </Link>
        <a href="tel:+917669933665" className="nav-cta">Call Store</a>
      </div>
    </nav>
  );
}
