import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => {
  return (
    <>
      <SEOHead 
        title="Privacy Policy"
        description="Read Regamos Foundation's privacy policy to understand how we collect, use, and protect your personal information."
        url="https://regamosfoundation.lovable.app/privacy-policy"
      />
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <p className="text-muted-foreground">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section aria-labelledby="introduction">
              <h2 id="introduction" className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                Regamos Foundation ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website or interact with our services.
              </p>
            </section>

            <section aria-labelledby="information-collection">
              <h2 id="information-collection" className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Register for membership</li>
                <li>Make a donation</li>
                <li>Submit a contact form</li>
                <li>Subscribe to our newsletter</li>
                <li>Apply for our programs</li>
              </ul>
              <p className="mt-4">This information may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Donation information and payment details</li>
                <li>Demographic information</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">2.2 Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>Pages visited and time spent</li>
                <li>Referring website addresses</li>
              </ul>
            </section>

            <section aria-labelledby="information-use">
              <h2 id="information-use" className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process donations and membership applications</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send newsletters and updates (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and enhance security</li>
              </ul>
            </section>

            <section aria-labelledby="information-sharing">
              <h2 id="information-sharing" className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing and Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Third-party vendors who help us operate our website and services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
            </section>

            <section aria-labelledby="data-security">
              <h2 id="data-security" className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, no 
                internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section aria-labelledby="your-rights">
              <h2 id="your-rights" className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section aria-labelledby="cookies">
              <h2 id="cookies" className="text-2xl font-semibold mt-8 mb-4">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience. 
                You can control cookies through your browser settings, but disabling them may affect 
                website functionality.
              </p>
            </section>

            <section aria-labelledby="children-privacy">
              <h2 id="children-privacy" className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
              <p>
                Our services are not directed to children under 13. We do not knowingly collect personal 
                information from children under 13. If you believe we have collected such information, 
                please contact us immediately.
              </p>
            </section>

            <section aria-labelledby="policy-changes">
              <h2 id="policy-changes" className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section aria-labelledby="contact">
              <h2 id="contact" className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at:</p>
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

export default PrivacyPolicy;
