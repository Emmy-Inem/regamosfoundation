import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
}

const SEOHead = ({
  title = "Regamos Foundation - Transforming Lives Through Empowerment",
  description = "Regamos Foundation empowers widows, orphans, abused girls, and youth through education, empowerment, and community development in Nigeria. Join us in making a difference.",
  keywords = "regamos foundation, widows empowerment, orphan care, youth development, community development, education, Nigeria NGO, charity, non-profit, donate, volunteer, empowerment programs",
  image = "https://regamosfoundation.lovable.app/og-image.png",
  url = "https://regamosfoundation.lovable.app",
  type = "website",
  author = "Regamos Foundation",
  publishedTime,
  modifiedTime,
  section,
}: SEOHeadProps) => {
  const fullTitle = title.includes("Regamos Foundation") ? title : `${title} | Regamos Foundation`;
  const siteName = "Regamos Foundation";
  
  // Generate Article structured data for blog posts
  const articleSchema = type === "article" ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "author": {
      "@type": "Organization",
      "name": author || siteName,
      "url": "https://regamosfoundation.lovable.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": "https://regamosfoundation.lovable.app/og-image.png"
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": section || "News"
  } : null;

  // Organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Regamos Foundation",
    "alternateName": "Regamos Foundation Nigeria",
    "url": "https://regamosfoundation.lovable.app",
    "logo": "https://regamosfoundation.lovable.app/og-image.png",
    "description": "Regamos Foundation empowers widows, orphans, abused girls, and youth through education, empowerment, and community development in Nigeria.",
    "foundingDate": "2020",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG",
      "addressRegion": "Nigeria"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+234-802-330-0639",
        "contactType": "Customer Service",
        "availableLanguage": ["English"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+234-907-666-4049",
        "contactType": "Customer Service",
        "availableLanguage": ["English"]
      }
    ],
    "email": "regamosfoundation@gmail.com",
    "sameAs": [
      "https://www.facebook.com/share/1ABfZYGXHo/",
      "https://x.com/Foundation_raf",
      "https://www.instagram.com/regamosfoundation",
      "https://www.linkedin.com/company/regamosfoundation/"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    },
    "knowsAbout": [
      "Widow Empowerment",
      "Orphan Care",
      "Youth Development",
      "Education Programs",
      "Community Development",
      "Skills Training"
    ]
  };

  // Website structured data for search box
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": "https://regamosfoundation.lovable.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://regamosfoundation.lovable.app/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Breadcrumb structured data
  const getBreadcrumbSchema = () => {
    const pathSegments = url.replace("https://regamosfoundation.lovable.app", "").split("/").filter(Boolean);
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://regamosfoundation.lovable.app"
      }
    ];

    let currentPath = "https://regamosfoundation.lovable.app";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      items.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        "item": currentPath
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    };
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="3 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      
      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="NG" />
      <meta name="geo.country" content="Nigeria" />
      <meta name="geo.placename" content="Nigeria" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_NG" />
      
      {/* Article specific OG tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@Foundation_raf" />
      <meta name="twitter:creator" content="@Foundation_raf" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1F8A55" />
      <meta name="msapplication-TileColor" content="#1F8A55" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="application-name" content={siteName} />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Structured Data - Website with Search */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {/* Structured Data - Breadcrumbs */}
      <script type="application/ld+json">
        {JSON.stringify(getBreadcrumbSchema())}
      </script>
      
      {/* Structured Data - Article (for blog posts) */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
