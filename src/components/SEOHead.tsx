import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
}

const SEOHead = ({
  title = "Regamos Foundation - Transforming Lives Through Empowerment",
  description = "Regamos Foundation empowers widows, orphans, abused girls, and youth through education, empowerment, and community development in Nigeria.",
  keywords = "regamos foundation, widows empowerment, orphan care, youth development, community development, education, Nigeria NGO, charity, non-profit",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  url = "https://regamosfoundation.lovable.app",
  type = "website",
  author = "Regamos Foundation",
}: SEOHeadProps) => {
  const fullTitle = title.includes("Regamos Foundation") ? title : `${title} | Regamos Foundation`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Regamos Foundation" />
      <meta property="og:locale" content="en_NG" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:site" content="@Foundation_raf" />
      <meta name="twitter:creator" content="@Foundation_raf" />
      
      {/* Schema.org for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          "name": "Regamos Foundation",
          "alternateName": "Regamos Foundation Nigeria",
          "url": url,
          "logo": image,
          "description": description,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "NG",
            "addressRegion": "Nigeria"
          },
          "sameAs": [
            "https://www.facebook.com/share/1ABfZYGXHo/",
            "https://x.com/Foundation_raf",
            "https://www.instagram.com/regamosfoundation",
            "https://www.linkedin.com/company/regamosfoundation/"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "availableLanguage": "English"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
