import Link from "next/link";
import { products } from "@/data/products";

export default function ShopPage() {
  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '60px' }}>
      <section>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="section-label">Catalog</span>
          <h1 className="section-title">All <span>Drops</span></h1>
        </div>
        
        <div className="collection-grid">
          {products.map(product => (
            <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
              <div className="collection-card card-1" style={{ border: '1px solid rgba(212,162,58,0.2)' }}>
                <div className="card-bg" style={{ 
                  background: `linear-gradient(180deg, transparent 40%, rgba(10,8,5,0.95) 100%), url(${product.images[0]}) center/cover`
                }}></div>
                <div className="card-content">
                  <div className="card-tag">{product.category}</div>
                  <div className="card-title" style={{ fontSize: '1.4rem' }}>{product.name}</div>
                  <div className="card-desc" style={{ color: 'var(--gold)' }}>₹{product.price}</div>
                  <div className="card-link">View Details →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
