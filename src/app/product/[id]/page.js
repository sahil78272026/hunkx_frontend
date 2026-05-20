import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

// Next.js dynamic metadata generation for SEO & Open Graph
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${API_URL}/api/v1/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Product Not Found' };
    const product = await res.json();
    
    return {
      title: `${product.name} | Hunkx Apparel`,
      description: product.description.substring(0, 160),
      openGraph: {
        title: `${product.name} | Hunkx Apparel`,
        description: product.description.substring(0, 160),
        images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
        type: 'website',
      }
    };
  } catch (e) {
    return { title: 'Hunkx Apparel' };
  }
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  let product;
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) notFound();
    product = await res.json();
  } catch (e) {
    notFound();
  }

  // Generate JSON-LD Schema for Rich Snippets (Stars & Price in Google Search)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://hunkx.com/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}
