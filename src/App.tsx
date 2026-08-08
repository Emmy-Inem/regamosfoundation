import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import SkipToContent from "@/components/SkipToContent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ScrollToTop from "@/components/ScrollToTop";
import PageLoadingSkeleton from "@/components/PageLoadingSkeleton";
import Index from "./pages/Index";

const About = lazy(() => import("./pages/About"));
const Programs = lazy(() => import("./pages/Programs"));
const Impact = lazy(() => import("./pages/Impact"));
const Blog = lazy(() => import("./pages/Blog"));
const Donate = lazy(() => import("./pages/Donate"));
const Membership = lazy(() => import("./pages/Membership"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Volunteer = lazy(() => import("./pages/Volunteer"));
const Partner = lazy(() => import("./pages/Partner"));
const Payment = lazy(() => import("./pages/Payment"));
const DynamicSitemap = lazy(() => import("./components/DynamicSitemap"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));
const EventHighlight = lazy(() => import("./pages/EventHighlight"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <SkipToContent />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <GoogleAnalytics />
          <Suspense fallback={<PageLoadingSkeleton />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/events/:id" element={<EventHighlight />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/blog-editor" element={<BlogEditor />} />
              <Route path="/blog-editor/:id" element={<BlogEditor />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/sitemap" element={<DynamicSitemap />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
