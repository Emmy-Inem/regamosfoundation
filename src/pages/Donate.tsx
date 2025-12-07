import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import FAQSchema from "@/components/schemas/FAQSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, Check, Users, GraduationCap, Home, Sparkles, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Donate = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const donationTiers = [
    { amount: 2000, label: "₦2,000", impact: "School supplies for 1 child" },
    { amount: 5000, label: "₦5,000", impact: "Week of meals for a family" },
    { amount: 10000, label: "₦10,000", impact: "Vocational training materials" },
    { amount: 25000, label: "₦25,000", impact: "Monthly scholarship for 1 student" },
  ];

  const impactAreas = [
    {
      icon: GraduationCap,
      title: "Education",
      description: "Support scholarships and educational materials",
    },
    {
      icon: Users,
      title: "Empowerment",
      description: "Fund vocational training and microloans",
    },
    {
      icon: Home,
      title: "Shelter",
      description: "Provide safe housing for abuse survivors",
    },
    {
      icon: Heart,
      title: "General Fund",
      description: "Support all our programs and initiatives",
    },
  ];

  const donateFaqs = [
    {
      question: "How can I donate to Regamos Foundation?",
      answer: "You can donate online through our secure payment portal using card payments, or via bank transfer to our Zenith Bank account (Regamos Foundation, Account Number: 1017935691). You can also contact us directly for other payment methods."
    },
    {
      question: "Is my donation tax-deductible?",
      answer: "Yes, donations to Regamos Foundation are tax-deductible. We provide official donation receipts for all contributions that can be used for tax purposes."
    },
    {
      question: "What is the minimum donation amount?",
      answer: "The minimum donation amount is ₦1,000. However, any amount is appreciated and helps us continue our mission of empowering vulnerable communities in Nigeria."
    },
    {
      question: "Where does my donation go?",
      answer: "100% of your donation goes directly to our programs including education scholarships, widow empowerment initiatives, youth skills training, shelter services, and community development projects. We maintain transparent financial reporting."
    },
    {
      question: "Can I set up recurring donations?",
      answer: "Yes, you can set up monthly recurring donations to provide sustained support for our programs. Contact us to arrange a recurring donation schedule that works for you."
    },
    {
      question: "How will I know my donation made an impact?",
      answer: "We provide monthly updates on our programs and their impact. Donors receive regular reports showing how their contributions are making a difference in the lives of widows, orphans, and youth across Nigeria."
    }
  ];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // Basic validation
    if (!donorInfo.name.trim() || !donorInfo.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    
    if (!amount || amount < 1000) {
      toast.error("Minimum donation amount is ₦1,000");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('donations')
        .insert([{
          donor_name: donorInfo.name,
          email: donorInfo.email,
          phone: donorInfo.phone,
          amount: amount,
          frequency: 'one-time',
          payment_status: 'pending',
        }]);

      if (error) throw error;

      // Navigate to payment page with donation details
      navigate("/payment", {
        state: {
          amount: amount.toString(),
          donorInfo: {
            name: donorInfo.name,
            email: donorInfo.email,
            phone: donorInfo.phone,
          }
        }
      });
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error("Failed to process donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Donate"
        description="Support Regamos Foundation's mission to empower widows, orphans, and youth. Your donation creates lasting impact in communities across Nigeria."
        url="https://regamosfoundation.lovable.app/donate"
      />
      <FAQSchema faqs={donateFaqs} />
      <div className="min-h-screen">
        <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full blur-glass border border-accent/20 mb-4">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Every Gift Makes a Difference</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Support Our <span className="text-primary">Mission</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your generosity transforms lives. Help us empower widows, educate orphans, and build stronger communities.
              </p>
            </div>
          </div>
        </section>

        {/* Donation Form */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Left: Donation Form */}
              <div className="animate-fade-in-up">
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6">Make a Donation</h2>
                    
                    <form onSubmit={handleDonate} className="space-y-6">
                      {/* Donation Amount */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium">Select Amount</label>
                        <div className="grid grid-cols-2 gap-3">
                          {donationTiers.map((tier) => (
                            <button
                              key={tier.amount}
                              type="button"
                              onClick={() => {
                                setSelectedAmount(tier.amount);
                                setCustomAmount("");
                              }}
                              className={`p-4 rounded-lg border-2 transition-smooth text-left ${
                                selectedAmount === tier.amount && !customAmount
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <div className="font-bold text-lg">{tier.label}</div>
                              <div className="text-xs text-muted-foreground mt-1">{tier.impact}</div>
                            </button>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="customAmount" className="text-sm font-medium">
                            Or Enter Custom Amount (₦)
                          </label>
                          <Input
                            id="customAmount"
                            type="number"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setSelectedAmount(null);
                            }}
                            min="1000"
                          />
                        </div>
                      </div>

                      {/* Donor Information */}
                      <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="font-semibold">Your Information</h3>
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={donorInfo.name}
                            onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={donorInfo.email}
                            onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">
                            Phone Number (Optional)
                          </label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="0802 330 0639"
                            value={donorInfo.phone}
                            onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <Button type="submit" variant="cta" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-5 w-5" />
                            Proceed to Payment
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        Secure payment processing. Your donation is tax-deductible.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Impact Areas & Info */}
              <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Where Your Money Goes</h3>
                    <div className="space-y-4">
                      {impactAreas.map((area, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-background/50 transition-smooth">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                            <area.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{area.title}</h4>
                            <p className="text-sm text-muted-foreground">{area.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Why Donate?</h3>
                    <ul className="space-y-4">
                      {[
                        "100% of donations go directly to programs",
                        "Tax-deductible receipts provided",
                        "Transparent financial reporting",
                        "Direct impact on lives",
                        "Monthly updates on progress",
                        "Option for recurring donations",
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft bg-gradient-to-br from-accent/10 to-primary/10">
                  <CardContent className="p-8 text-center space-y-4">
                    <Heart className="h-12 w-12 text-accent mx-auto" />
                    <h3 className="text-xl font-bold">Prefer Other Methods?</h3>
                    <p className="text-sm text-muted-foreground">
                      You can also donate via bank transfer or mobile money
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Alternative Methods
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Alternative Donation Methods</DialogTitle>
                          <DialogDescription>
                            Choose your preferred payment method below
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold">Bank Transfer</h4>
                            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Bank Name:</span>
                                <span className="font-medium">Zenith Bank</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Account Name:</span>
                                <span className="font-medium">Regamos Foundation</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Account Number:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">1017935691</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      navigator.clipboard.writeText("1017935691");
                                      toast.success("Account number copied!");
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">Contact Us</h4>
                            <p className="text-sm text-muted-foreground">
                              For other payment methods or questions, please contact us:
                            </p>
                            <div className="text-sm space-y-1">
                              <p>📞 0802 330 0639 / 0907 666 4049</p>
                              <p>📧 regamosfoundation@gmail.com</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default Donate;
