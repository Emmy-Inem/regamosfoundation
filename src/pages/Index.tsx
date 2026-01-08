import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Programs from "@/components/Programs";
import TestimonialsSection from "@/components/TestimonialsSection";
import UpcomingProgramsSection from "@/components/UpcomingProgramsSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <>
      <SEOHead />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Hero />
          <Mission />
          <Programs />
          <UpcomingProgramsSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
