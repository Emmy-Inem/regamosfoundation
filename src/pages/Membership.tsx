import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Check, Heart, BookOpen, Briefcase, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const membershipSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
  category: z.enum(["widow", "youth"], { required_error: "Please select a category" }),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(500),
  reason: z.string().trim().min(20, "Please provide more details (at least 20 characters)").max(1000),
});

const Membership = () => {
  const [selectedCategory, setSelectedCategory] = useState<"widow" | "youth" | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    reason: "",
  });

  const categories = [
    {
      type: "widow" as const,
      icon: Heart,
      title: "Widow Membership",
      fee: "₦2,000/year",
      benefits: [
        "Access to vocational training programs",
        "Business mentorship and support",
        "Microloan opportunities",
        "Community support groups",
        "Skills development workshops",
        "Networking events",
      ],
    },
    {
      type: "youth" as const,
      icon: Users,
      title: "Youth Membership",
      fee: "₦1,500/year",
      benefits: [
        "Career guidance and counseling",
        "Skills training programs",
        "Mentorship opportunities",
        "Job placement assistance",
        "Leadership development",
        "Access to educational resources",
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error("Please select a membership category");
      return;
    }

    try {
      // Validate form data
      const validatedData = membershipSchema.parse({
        ...formData,
        category: selectedCategory,
      });

      // Here you would send the data to your backend
      toast.success("Application submitted successfully! Check your email for payment instructions.");
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        reason: "",
      });
      setSelectedCategory(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full blur-glass border border-primary/20 mb-4">
                <UserPlus className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Join Our Community</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Become a <span className="text-primary">Member</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join a supportive community dedicated to empowerment, growth, and positive change
              </p>
            </div>
          </div>
        </section>

        {/* Membership Categories */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Membership</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select the membership category that best fits your needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              {categories.map((category, index) => (
                <Card
                  key={category.type}
                  className={`border-2 transition-smooth cursor-pointer animate-fade-in-up ${
                    selectedCategory === category.type
                      ? "border-primary shadow-glow bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedCategory(category.type)}
                >
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <category.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                      <p className="text-3xl font-bold text-accent">{category.fee}</p>
                    </div>
                    <ul className="space-y-3">
                      {category.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={selectedCategory === category.type ? "cta" : "outline"}
                      className="w-full mt-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(category.type);
                      }}
                    >
                      {selectedCategory === category.type ? "Selected" : "Select"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Application Form */}
            {selectedCategory && (
              <Card className="border-0 shadow-soft max-w-3xl mx-auto animate-fade-in">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">Complete Your Application</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">
                          Last Name *
                        </label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0802 330 0639"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Address *
                      </label>
                      <Input
                        id="address"
                        placeholder="Your full address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="reason" className="text-sm font-medium">
                        Why do you want to join? *
                      </label>
                      <Textarea
                        id="reason"
                        placeholder="Tell us about yourself and why you'd like to become a member..."
                        rows={5}
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        required
                      />
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm">
                        <strong>Selected:</strong> {selectedCategory === "widow" ? "Widow Membership" : "Youth Membership"} -{" "}
                        {selectedCategory === "widow" ? "₦2,000/year" : "₦1,500/year"}
                      </p>
                    </div>

                    <Button type="submit" variant="cta" size="lg" className="w-full">
                      Submit Application
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      After submission, you'll receive payment instructions via email. Membership activates upon payment confirmation.
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: BookOpen,
                  title: "Continuous Learning",
                  description: "Access to workshops, training sessions, and educational resources year-round",
                },
                {
                  icon: Users,
                  title: "Community Support",
                  description: "Connect with others on similar journeys and build lasting relationships",
                },
                {
                  icon: Briefcase,
                  title: "Career Growth",
                  description: "Opportunities for skill development and economic empowerment",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-glow transition-smooth text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Membership;
