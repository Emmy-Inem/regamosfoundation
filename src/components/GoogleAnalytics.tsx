import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Replace with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const initGA = () => {
  if (typeof window === 'undefined' || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.log('Google Analytics: Using placeholder ID. Replace G-XXXXXXXXXX with your actual Measurement ID.');
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

export const trackPageView = (path: string) => {
  if (typeof window === 'undefined' || !window.gtag || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return;
  }
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return;
  }
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default GoogleAnalytics;
