import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import SEOHead from "@/components/SEOHead";
import FAQSchema from "@/components/schemas/FAQSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Target, Award, Shield, Handshake, CheckCircle, Star, GraduationCap, BookOpen, Crown } from "lucide-react";
import academyLogo from "@/assets/regamos-academy-logo.png";

const About = () => {
  const coreValues = [
    {
      icon: Heart,
      title: "Love & Compassion",
      description: "We approach every individual with empathy, understanding, and unconditional care.",
    },
    {
      icon: Shield,
      title: "Integrity & Accountability",
      description: "Transparency and honesty guide all our operations and interactions with stakeholders.",
    },
    {
      icon: Users,
      title: "Partnership & Teamwork",
      description: "We believe in collaborative efforts to achieve greater impact in our communities.",
    },
    {
      icon: Star,
      title: "Long Term Commitment",
      description: "We are dedicated to sustained support and lasting impact in the lives we touch.",
    },
  ];

  const goals = [
    "To improve the economic power of widows, youth and less privileged through education and empowerment programmes",
    "To provide training and mentorship support for widows, young people and less privileged through entrepreneurial initiatives",
    "To increase awareness on adolescent sexual/health education and career development through community based programmes",
    "To collaborate with like-minded organizations at community, regional and international levels for the benefit of target beneficiaries",
  ];

  const aboutFaqs = [
    {
      question: "What is Regamos Foundation?",
      answer: "REGAMOS Foundation (RAF) is a private, voluntary, non-profit, faith-based, Non-Governmental Organization focused on easing the burden of widows, orphans and youth. Founded in January 2018 with the passion of empowering widows and less privileged, it was incorporated March 3rd 2020."
    },
    {
      question: "Who founded Regamos Foundation?",
      answer: "Regamos Foundation was founded by Amb. (Dr) Regina Inem, a dynamic Nigerian businesswoman, educational consultant and philanthropist. She holds multiple degrees including Agriculture, Education, Educational Psychology, Executive Master's in Project Management (UK), Doctorate in Theology, and an honorary doctorate in Business Management from Swiss School of Business and Management, Geneva."
    },
    {
      question: "What is the mission of Regamos Foundation?",
      answer: "Our mission is to improve the livelihood of widows, young people, abused girls and the less privileged through Advocacy, Education, Economic Empowerment, Psychological Support, Entrepreneurship Training and Community Development Initiatives."
    },
    {
      question: "What are Regamos Foundation's core values?",
      answer: "Our core values are Love and Compassion, Obedience to God's call, Long Term Commitment, Respect for every Individual, Partnership, Teamwork, Integrity and Accountability."
    },
    {
      question: "Why does Regamos Foundation focus on widows?",
      answer: "All over the world, there are approximately 100 million widows living in poverty today. Millions of widows have been abused, ostracized and abandoned simply because they are widows. Many are victims of property theft, social isolation, and abuse. We at REGAMOS Foundation have refused to look the other way."
    },
    {
      question: "Is Regamos Foundation a registered organization?",
      answer: "Yes, Regamos Foundation was founded in January 2018 and officially incorporated on March 3rd, 2020 as a registered NGO in Nigeria. We operate with full transparency and provide regular reports to stakeholders."
    }
  ];

  return (
    <>
      <SEOHead 
        title="About Us"
        description="Learn about Regamos Foundation's mission to empower widows, orphans, abused girls, and youth through education and community development in Nigeria. Founded by Dr. Regina Inem."
        url="https://regamosfoundation.lovable.app/about"
      />
      <FAQSchema faqs={aboutFaqs} />
      <div className="min-h-screen">
        <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                About <span className="text-primary">Regamos Foundation</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed px-2">
                Educate. Empower. Advocate - A faith-based organization committed to transforming lives
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 md:space-y-12 animate-fade-in-up">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Our Story</h2>
                <div className="space-y-4 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    REGAMOS Foundation (RAF) is a private, voluntary, non-profit, faith-based, Non-Governmental Organization focused on easing the burden of widows, orphans and youth. REGAMOS Foundation was founded in January 2018 with the passion of empowering widows and less privileged. It was incorporated March 3rd 2020.
                  </p>
                  <p>
                    All over the world, there are approximately 100 million widows living in poverty today. Millions of widows have been abused and millions have been ostracized and abandoned around the world, simply because they are widows. An unknown number of widows have been targeted for rape, torture and murder, others are forced into prostitution, re-marriage and many are victims of property theft, social isolation, physical and psychological abuse.
                  </p>
                  <p>
                    It is shocking but what is even more shocking is how few people are aware of this gross violation of Human Rights and yet decide to look the other way. We at REGAMOS Foundation have refused to look the other way. We have decided not to abandon the orphans, widows or their children and other less privileged people in the society.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Meet Our Founder</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                  The visionary behind REGAMOS Foundation
                </p>
              </div>
              
              <Card className="border-0 shadow-soft animate-fade-in-up">
                <CardContent className="p-6 sm:p-8 md:p-10">
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Amb. (Dr) Regina Inem</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Chairman, Board of Trustees - REGAMOS Foundation</p>
                    
                    <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      <p>
                        Amb. (Dr) Regina Inem is a dynamic Nigerian businesswoman, educational consultant and philanthropist who has established herself as one of Africa's foremost entrepreneurs. She holds a degree in Agriculture, a Post Graduate in Education, Master's Degree in Educational Psychology, Executive Master's Degree in Project Management U.K., a Doctorate in Theology and an honorary doctorate in Business Management by the Swiss School of Business and Management, Geneva, Switzerland.
                      </p>
                      <p>
                        Before venturing into business, Regina has been a Teacher, School Administrator and Principal of the best schools in Nigeria. She is also an experienced school consultant and researcher who has consulted for government, organizations, and schools in Nigeria and overseas.
                      </p>
                      <p>
                        Eventually, she followed her heart and creative calling to founding her first company REGAMOS Consulting, a foremost educational consulting firm. A year later she founded REGAMOS Farms and Agro-Allied Services. In obedience to the word of God and working according to His will and purpose, she founded the REGAMOS Foundation with a mandate to help widows and their children as well as orphans, youth and the vulnerable, taking away hopelessness and wiping away tears.
                      </p>
                      <p>
                        She is a Fellow of the Institute of Information Management and also a Fellow of the Unicaribbean Business School, member of Organization for Women in Science for the Developing World, Young Africa Leaders Initiative and an Alumnus of ITC SME Academy in Geneva, Switzerland. She is a beneficiary of the She Trades in the commonwealth project in Nigeria.
                      </p>
                      <p>
                        She is widely travelled and has participated in conferences, seminars and workshops in the United Kingdom, UAE, Malaysia and U.S.A. As a teacher advocate, she is a Nigerian ambassador of 1 Million Teachers Inc. a Canadian based NGO. She is a recipient of more than 14 awards in various capacities locally and internationally for her contributions to the development of education in Nigeria and Africa.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Our Goals</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                  Strategic objectives guiding our impact
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
                {goals.map((goal, index) => (
                  <Card key={index} className="border-0 shadow-soft hover:shadow-glow transition-smooth">
                    <CardContent className="p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 shrink-0">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{goal}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Our Core Values</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
              {coreValues.map((value, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up bg-card/80 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-5 sm:p-6 md:p-8 text-center space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-2">
                      <value.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">{value.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Regamos Royal Academy Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
                <div className="flex justify-center mb-6">
                  <img src={academyLogo} alt="Regamos Royal Academy Logo" className="h-32 sm:h-40 md:h-48 w-auto" />
                </div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-medium mb-4">
                  Social Enterprise
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Regamos Royal Academy</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
                  A Social Enterprise of Regamos Foundation - Creche, Early Years and Primary learning community providing high quality, well-rounded education where every child matters.
                </p>
              </div>

              <Card className="border-0 shadow-soft animate-fade-in-up mb-8">
                <CardContent className="p-6 sm:p-8 md:p-10">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3">About the Academy</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Regamos Royal Academy provides high quality, well-rounded education where every child matters and is groomed to make a difference globally. We run a blend of the British-Nigerian curriculum fully integrated with technology, delivered through Activity Based Learning with a focus on raising globally-minded impact champions.
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Our Teachers are caring and strongly committed to providing an environment where all children have the opportunity to learn to a high level and be equipped with life skills. Staff continually seek to improve their teaching skills and enhance the social and academic learning of each child in their classroom.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-0 shadow-soft animate-fade-in-up">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10">
                        <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold">School Vision</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      An inclusive learning environment where every child is given the opportunity to thrive, excel and impact.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10">
                        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold">School Mission</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      To provide a nurturing environment that produces Godly citizens, academic achievers and global influencers equipped with critical thinking skills, problem solving skills, life skills, creativity, global perspective, respect for core values of honesty, loyalty, perseverance, and compassion.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-soft animate-fade-in-up bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6 sm:p-8 md:p-10 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Motto</h3>
                  <p className="text-lg sm:text-xl md:text-2xl text-primary font-semibold italic">"Nurturing Impact Makers"</p>
                  <p className="text-sm sm:text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
                    We develop our students to "do the right things, in the right way, with the right people, for the right reasons".
                  </p>
                </CardContent>
              </Card>

              <div className="mt-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-6">Core Values - As Impact Makers We:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Heart, value: "Love God" },
                    { icon: Crown, value: "Leadership" },
                    { icon: Shield, value: "Live Responsibly" },
                    { icon: Users, value: "Work Collaboratively" },
                    { icon: BookOpen, value: "Are Resourceful" },
                    { icon: Handshake, value: "Practice Empathy" },
                    { icon: Star, value: "Are True to Personal Values" },
                  ].map((item, index) => (
                    <Card key={index} className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <CardContent className="p-4 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium">{item.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <TeamSection />
      </main>
      <Footer />
    </div>
    </>
  );
};

export default About;