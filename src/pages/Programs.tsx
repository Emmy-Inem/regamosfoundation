import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UpcomingProgramsSection from "@/components/UpcomingProgramsSection";
import EventCalendar from "@/components/EventCalendar";
import SEOHead from "@/components/SEOHead";
import FAQSchema from "@/components/schemas/FAQSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  HeartHandshake, 
  Lightbulb, 
  BookOpen,
  Briefcase,
  Heart,
  Home,
  Coins,
  Wrench,
  Scale,
  Wheat,
  UserPlus,
  BadgeCheck
} from "lucide-react";
import educationImg from "@/assets/education.jpg";
import empowermentImg from "@/assets/empowerment.jpg";
import communityImg from "@/assets/community.jpg";

const Programs = () => {
  const empowermentPrograms = [
    {
      icon: Coins,
      title: "Microcredit Scheme (MICS)",
      description: "The RAF Microcredit Scheme provides interest-free loans to widows and youth with a flexible repayment plan that spans over a period of 18 months. This program has been effective in boosting the economic activities of our widows and youth, increasing their household income and enabling them to cater for their families. To encourage timely repayment, beneficiaries are grouped into Self-Help-Groups (SHGs).",
    },
    {
      icon: Wrench,
      title: "Skills Acquisition & Vocational Scheme (SAVS)",
      description: "Widows are most times the breadwinners of their families and therefore require assistance in alleviating heavy financial burdens. The RAF Skills Acquisition & Vocational Scheme (SAVS) is designed to provide sustainable income-generating skills for widows, vulnerable women and youth including tailoring, catering, and crafts.",
    },
    {
      icon: Briefcase,
      title: "Small and Medium Enterprise (SAME)",
      description: "The RAF Small and Medium Enterprise (SAME) programme enhances self-initiative and encourages women, especially widows, to establish small and medium enterprises. SAME provides training and follow-ups required for success in their chosen trade or profession through partnerships with developmental organizations and private sector.",
    },
    {
      icon: Heart,
      title: "RAF Live Support Scheme (RLSS)",
      description: "We understand that a little help at a crucial moment can change the lives of widows and their families. We provide live support through counselling as well as monthly allowances for non-active widows and orphans.",
    },
    {
      icon: Wheat,
      title: "Agric-Business Scheme (ABS)",
      description: "The RAF Agric-Business Scheme (ABS) empowers rural widows and vulnerable women to work in the agricultural sector with access to finance, knowledge and training for sustainable livelihoods through farming, guaranteeing food security for their children.",
    },
    {
      icon: Scale,
      title: "Legal Support Services (LSS)",
      description: "To help widows and their children access their late husband's or father's assets and have claims to his gratuity, the RAF provides free legal consultations to hundreds of widows and orphans.",
    },
  ];

  const mentoringPrograms = [
    {
      icon: Users,
      title: "Widows-for-Widows Mentorship (WFWP)",
      description: "Experienced widow entrepreneurs mentor newly empowered widows to become RAF Ambassadors with success stories.",
    },
    {
      icon: UserPlus,
      title: "Orphans-for-Orphans Mentorship (OFMP)",
      description: "Successful orphan beneficiaries mentor and guide other orphans on their journey to success.",
    },
    {
      icon: Lightbulb,
      title: "Youth for Youth Mentorship (YFMP)",
      description: "Young successful professionals mentor youth to develop skills and achieve their career goals.",
    },
    {
      icon: BadgeCheck,
      title: "Girls for Girls Mentorship (GFGP)",
      description: "Empowered girls mentor and support other girls facing challenges to build confidence and skills.",
    },
  ];

  const educationalPrograms = [
    {
      icon: GraduationCap,
      title: "RAF Scholarship Programme (RAFSP)",
      description: "At the RAF we believe that education is a right not a privilege. Through this program, widows' children and orphans receive free education, fully sponsored by the Foundation.",
    },
    {
      icon: BookOpen,
      title: "Community Impact Education Programme (CIEP)",
      description: "This program provides sustainable solutions to obstacles that prevent children from less privileged backgrounds from gaining quality education. We work closely with local communities and schools to increase access to quality primary and secondary education by improving the learning environment.",
    },
  ];

  const mainPrograms = [
    {
      icon: Users,
      title: "Women Empowerment",
      description:
        "We believe that women are key actors in improving household livelihoods and industry competitiveness. We develop realistic and locally relevant gender-inclusion strategies, support women-owned and women-operated businesses, and build the skills and self-confidence of adolescent girls and young women to empower them to make important decisions about their economic and social well-being.",
      image: empowermentImg,
      color: "primary",
      features: [
        "Enterprise development training",
        "Skills acquisition and vocational training",
        "Agribusiness (farming, fishery, piggery, poultry)",
        "Donation of machinery/equipment and farmlands"
      ]
    },
    {
      icon: Lightbulb,
      title: "Youth Development",
      description:
        "We promote positive youth development by providing young people with the knowledge and skills they need to fulfil their potential. We work with local partners to design asset-based interventions and deliver demand-driven products and services that increase young people's ability to obtain meaningful work, engage in value chains, access finance, and become leaders in their communities.",
      image: educationImg,
      color: "accent",
      features: [
        "Digital skills and computer training",
        "Entrepreneurship and business skills",
        "Leadership development programs",
        "Job placement and career guidance"
      ]
    },
    {
      icon: HeartHandshake,
      title: "Community Development",
      description:
        "We work to create sustainable communities through infrastructure improvements, health initiatives, economic empowerment programs, and capacity building for local organizations. Our community-based programmes create safe and enabling communities for women and vulnerable children.",
      image: communityImg,
      color: "primary",
      features: [
        "Infrastructure development projects",
        "Health awareness and medical outreach",
        "Adolescent sexual/health education",
        "Career development programs"
      ]
    },
    {
      icon: Home,
      title: "Shelter & Protection",
      description:
        "Safe shelter and protection services for abused girls and vulnerable women, providing a secure environment for healing and recovery. We provide psychological support and counselling services.",
      image: empowermentImg,
      color: "accent",
      features: [
        "Emergency shelter and safe houses",
        "Legal support and advocacy",
        "Psychological counseling",
        "Rehabilitation and reintegration programs"
      ]
    }
  ];

  const programsFaqs = [
    {
      question: "What is the RAF Empowerment Programme?",
      answer: "The RAF Empowerment Programme (RAFEP) is designed to provide business and life support services to widows who are breadwinners of their families and vulnerable youth. It includes Microcredit Scheme, Skills Acquisition, Small and Medium Enterprise support, Live Support, Agric-Business, and Legal Support Services."
    },
    {
      question: "How does the Microcredit Scheme work?",
      answer: "The RAF Microcredit Scheme provides interest-free loans to widows and youth with a flexible repayment plan spanning 18 months. Beneficiaries are grouped into Self-Help-Groups (SHGs) to encourage timely repayment and mutual support."
    },
    {
      question: "What mentorship programs does RAF offer?",
      answer: "RAF offers four mentorship programs: Widows-for-Widows Mentorship (WFWP), Orphans-for-Orphans Mentorship (OFMP), Youth for Youth Mentorship (YFMP), and Girls for Girls Mentorship (GFGP). These programs create RAF Ambassadors with success stories."
    },
    {
      question: "What educational support does RAF provide?",
      answer: "RAF provides the Scholarship Programme (RAFSP) offering free education for widows' children and orphans, and the Community Impact Education Programme (CIEP) which works with communities to improve access to quality education."
    },
    {
      question: "How can I benefit from RAF programs?",
      answer: "You can apply to become a beneficiary through our contact page or by calling 08148568820 or WhatsApp 08023300639. Eligibility is determined through our assessment process based on need and program criteria."
    },
    {
      question: "Does RAF provide legal support?",
      answer: "Yes, the Legal Support Services (LSS) provides free legal consultations to help widows and their children access their late husband's or father's assets and claims to gratuity."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Our Programs"
        description="Explore Regamos Foundation's comprehensive programs including Microcredit Scheme, Skills Training, Mentorship, Education Scholarships, and Community Development initiatives."
        url="https://regamosfoundation.lovable.app/programs"
      />
      <FAQSchema faqs={programsFaqs} />
      <div className="min-h-screen">
        <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                Our <span className="text-primary">Programs</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed px-2">
                Comprehensive initiatives designed to create lasting change and empower widows, youth, and vulnerable communities across Nigeria
              </p>
            </div>
          </div>
        </section>

        {/* Main Programs Grid */}
        <section className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-12 sm:space-y-14 md:space-y-16">
              {mainPrograms.map((program, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                    <div className={`relative h-64 sm:h-72 md:h-80 lg:h-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
                      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full ${
                            program.color === "primary" ? "bg-primary" : "bg-accent"
                          } shadow-glow`}
                        >
                          <program.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className={`p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{program.title}</h2>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                        {program.description}
                      </p>
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        {program.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 sm:gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 sm:mt-2 ${
                              program.color === "primary" ? "bg-primary" : "bg-accent"
                            }`} />
                            <span className="text-xs sm:text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="cta" size="lg" className="w-fit" asChild>
                        <Link to="/contact">Get Involved</Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Empowerment Programs Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">RAF Empowerment Programme</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
                Business and life support services for widows who are breadwinners of their families and vulnerable youth
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {empowermentPrograms.map((program, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10">
                      <program.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">{program.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{program.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mentoring Programs Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">RAF Mentoring Programme</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
                Mentoring selected young widow entrepreneurs, girls, youth and orphaned school leavers to become RAF Ambassadors
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {mentoringPrograms.map((program, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up bg-gradient-to-br from-accent/5 to-primary/5"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-5 sm:p-6 text-center space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 mx-auto">
                      <program.icon className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold">{program.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{program.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Educational Programs Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">RAF Educational Programme</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
                Ensuring orphans and students from less privileged backgrounds have continuous access to quality education
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {educationalPrograms.map((program, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 sm:p-8 space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10">
                      <program.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">{program.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{program.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Event Calendar Section */}
        <EventCalendar />

        {/* Upcoming Programs Section */}
        <UpcomingProgramsSection />

        {/* CTA Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/10 to-accent/10 max-w-4xl mx-auto">
              <CardContent className="p-8 sm:p-10 md:p-12 text-center space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Your support helps us continue these vital programs and reach more people in need.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
                  <Button variant="cta" size="lg" asChild>
                    <Link to="/donate">Donate Now</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/membership">Become a Member</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default Programs;