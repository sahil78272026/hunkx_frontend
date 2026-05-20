export default async function sitemap() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  let products = [];
  
  try {
    const res = await fetch(`${API_URL}/api/v1/products/`, { next: { revalidate: 3600 } });
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch products for sitemap", error);
  }

  const productUrls = products.map((product) => ({
    url: `https://hunkx.com/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://hunkx.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://hunkx.com/shop',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
