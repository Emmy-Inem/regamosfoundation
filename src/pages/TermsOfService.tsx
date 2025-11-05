import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const TermsOfService = () => {
  return (
    <>
      <SEOHead 
        title="Terms of Service"
        description="Read Regamos Foundation's terms of service to understand the rules and regulations governing the use of our website and services."
        url="https://regamosfoundation.lovable.app/terms-of-service"
      />
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <p className="text-muted-foreground">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section aria-labelledby="agreement">
              <h2 id="agreement" className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using the Regamos Foundation website ("Website"), you accept and agree to be 
                bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not 
                use our Website.
              </p>
            </section>

            <section aria-labelledby="use-license">
              <h2 id="use-license" className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily access the materials on Regamos Foundation's Website 
                for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
              </p>
              <p className="mt-4">Under this license, you may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes</li>
                <li>Attempt to reverse engineer any software on the Website</li>
                <li>Remove copyright or proprietary notations from materials</li>
                <li>Transfer materials to another person or "mirror" materials on another server</li>
              </ul>
            </section>

            <section aria-labelledby="donations">
              <h2 id="donations" className="text-2xl font-semibold mt-8 mb-4">3. Donations</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2">3.1 General</h3>
              <p>
                All donations made to Regamos Foundation are voluntary and non-refundable unless otherwise 
                required by law. Donations are used to support our mission of empowering widows, orphans, 
                abused girls, and youth through education and community development.
              </p>
              
              <h3 className="text-xl font-semibold mt-4 mb-2">3.2 Tax Deductibility</h3>
              <p>
                Regamos Foundation is a registered non-profit organization. Donations may be tax-deductible 
                to the extent permitted by law. Please consult with your tax advisor regarding the deductibility 
                of your donation.
              </p>

              <h3 className="text-xl font-semibold mt-4 mb-2">3.3 Payment Methods</h3>
              <p>
                We currently accept donations via bank transfer to our Zenith Bank account. All donation 
                details will be handled securely and in accordance with our Privacy Policy.
              </p>
            </section>

            <section aria-labelledby="membership">
              <h2 id="membership" className="text-2xl font-semibold mt-8 mb-4">4. Membership</h2>
              <p>
                Membership applications are subject to approval by Regamos Foundation. We reserve the right 
                to accept or reject any membership application at our discretion. Members must comply with 
                our code of conduct and organizational values.
              </p>
            </section>

            <section aria-labelledby="user-content">
              <h2 id="user-content" className="text-2xl font-semibold mt-8 mb-4">5. User-Generated Content</h2>
              <p>
                By submitting content (testimonials, comments, photos, etc.) to our Website, you grant 
                Regamos Foundation a non-exclusive, royalty-free, perpetual license to use, reproduce, 
                modify, and display such content for promotional and operational purposes.
              </p>
            </section>

            <section aria-labelledby="disclaimer">
              <h2 id="disclaimer" className="text-2xl font-semibold mt-8 mb-4">6. Disclaimer</h2>
              <p>
                The materials on Regamos Foundation's Website are provided on an 'as is' basis. Regamos 
                Foundation makes no warranties, expressed or implied, and hereby disclaims and negates all 
                other warranties including, without limitation, implied warranties or conditions of 
                merchantability, fitness for a particular purpose, or non-infringement of intellectual 
                property or other violation of rights.
              </p>
            </section>

            <section aria-labelledby="limitations">
              <h2 id="limitations" className="text-2xl font-semibold mt-8 mb-4">7. Limitations of Liability</h2>
              <p>
                In no event shall Regamos Foundation or its suppliers be liable for any damages (including, 
                without limitation, damages for loss of data or profit, or due to business interruption) 
                arising out of the use or inability to use the materials on our Website.
              </p>
            </section>

            <section aria-labelledby="accuracy">
              <h2 id="accuracy" className="text-2xl font-semibold mt-8 mb-4">8. Accuracy of Materials</h2>
              <p>
                The materials appearing on Regamos Foundation's Website could include technical, typographical, 
                or photographic errors. We do not warrant that any materials are accurate, complete, or current. 
                We may make changes to the materials at any time without notice.
              </p>
            </section>

            <section aria-labelledby="links">
              <h2 id="links" className="text-2xl font-semibold mt-8 mb-4">9. Links to Third-Party Sites</h2>
              <p>
                Our Website may contain links to third-party websites. These links are provided for your 
                convenience only. We have no control over the content of these sites and accept no 
                responsibility for them or for any loss or damage that may arise from your use of them.
              </p>
            </section>

            <section aria-labelledby="modifications">
              <h2 id="modifications" className="text-2xl font-semibold mt-8 mb-4">10. Modifications to Terms</h2>
              <p>
                Regamos Foundation may revise these Terms of Service at any time without notice. By using 
                this Website, you agree to be bound by the current version of these Terms.
              </p>
            </section>

            <section aria-labelledby="governing-law">
              <h2 id="governing-law" className="text-2xl font-semibold mt-8 mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of Nigeria, without 
                regard to its conflict of law provisions.
              </p>
            </section>

            <section aria-labelledby="contact">
              <h2 id="contact" className="text-2xl font-semibold mt-8 mb-4">12. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <address className="not-italic mt-4">
                <strong>Regamos Foundation</strong><br />
                Email: <a href="mailto:info@regamosfoundation.org" className="text-primary hover:underline">info@regamosfoundation.org</a><br />
                Phone: +234 XXX XXX XXXX
              </address>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;
