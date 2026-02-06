import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID from environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) {
    if (import.meta.env.DEV) {
      console.log('Google Analytics: No measurement ID configured. Add VITE_GA_MEASUREMENT_ID to enable tracking.');
    }
    return;
  }

  // Avoid duplicate initialization
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
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
    send_page_view: true,
  });
};

export const trackPageView = (path: string) => {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) {
    return;
  }
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) {
    return;
  }
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track custom events for the foundation
export const trackDonation = (amount: number, frequency: string) => {
  trackEvent('donation', 'engagement', frequency, amount);
};

export const trackNewsletterSignup = () => {
  trackEvent('newsletter_signup', 'engagement');
};

export const trackBlogView = (postId: string, title: string) => {
  trackEvent('blog_view', 'content', title);
};

export const trackVolunteerSignup = () => {
  trackEvent('volunteer_signup', 'engagement');
};

export const trackContactSubmission = () => {
  trackEvent('contact_form', 'engagement');
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
