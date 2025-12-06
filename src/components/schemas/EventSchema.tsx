import { Helmet } from 'react-helmet-async';

interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
  url?: string;
  organizer?: string;
  status?: 'EventScheduled' | 'EventPostponed' | 'EventCancelled' | 'EventRescheduled';
}

const EventSchema = ({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
  organizer = 'Regamos Foundation',
  status = 'EventScheduled',
}: EventSchemaProps) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "startDate": startDate,
    ...(endDate && { "endDate": endDate }),
    "eventStatus": `https://schema.org/${status}`,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": location,
        "addressCountry": "NG"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": organizer,
      "url": "https://regamosfoundation.lovable.app"
    },
    ...(image && { "image": image }),
    ...(url && { "url": url }),
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "NGN",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default EventSchema;
