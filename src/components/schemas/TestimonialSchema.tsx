import { Helmet } from "react-helmet-async";

interface Testimonial {
  author_name: string;
  author_role?: string | null;
  testimonial_text: string;
  rating?: number | null;
}

interface TestimonialSchemaProps {
  testimonials: Testimonial[];
  itemReviewed?: {
    name: string;
    type: string;
  };
}

const TestimonialSchema = ({ testimonials, itemReviewed }: TestimonialSchemaProps) => {
  if (!testimonials || testimonials.length === 0) return null;

  // Calculate aggregate rating
  const ratingsWithValues = testimonials.filter(t => t.rating && t.rating > 0);
  const averageRating = ratingsWithValues.length > 0
    ? ratingsWithValues.reduce((sum, t) => sum + (t.rating || 5), 0) / ratingsWithValues.length
    : 5;

  const aggregateSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": itemReviewed?.name || "Regamos Foundation",
    "@id": "https://regamosfoundation.lovable.app/#organization",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": testimonials.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": testimonials.map((testimonial) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": testimonial.author_name
      },
      "reviewBody": testimonial.testimonial_text,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.rating || 5,
        "bestRating": "5",
        "worstRating": "1"
      },
      ...(testimonial.author_role && {
        "author": {
          "@type": "Person",
          "name": testimonial.author_name,
          "jobTitle": testimonial.author_role
        }
      })
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(aggregateSchema)}
      </script>
    </Helmet>
  );
};

export default TestimonialSchema;
