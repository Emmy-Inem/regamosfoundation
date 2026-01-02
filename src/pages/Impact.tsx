import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Heart, TrendingUp, Award, CheckCircle } from "lucide-react";
import educationImg from "@/assets/education.jpg";
import empowermentImg from "@/assets/empowerment.jpg";
import communityImg from "@/assets/community.jpg";

const Impact = () => {
  const stats = [
    { icon: Users, number: "2,000+", label: "Youth Empowered", color: "primary" },
    { icon: Heart, number: "800+", label: "Women & Widows Impacted", color: "accent" },
    { icon: GraduationCap, number: "3,000+", label: "Children Reached", color: "primary" },
    { icon: Award, number: "300+", label: "Medical Outreach Recipients", color: "accent" },
  ];

  const stories = [
    {
      name: "Amaka's Story",
      title: "From Widow to Entrepreneur",
      image: empowermentImg,
      story:
        "After losing her husband, Amaka was left to care for her three children alone. Through our widow empowerment program, she learned tailoring skills and received a microloan to start her own business. Today, she runs a successful tailoring shop and employs two other widows.",
      impact: "Now supporting 5 families",
    },
    {
      name: "David's Journey",
      title: "Youth Skills Training Success",
      image: educationImg,
      story:
        "David joined our youth training program as a school dropout with no prospects. Through digital skills training and mentorship, he discovered his passion for graphic design. He now works as a freelance designer and mentors other young people in the program.",
      impact: "Earning sustainable income",
    },
    {
      name: "Community Transformation",
      title: "Empowering Entire Villages",
      image: communityImg,
      story:
        "In a rural community outside Lagos, we implemented a comprehensive development program including education, health awareness, and economic empowerment. The community now has a functional school, health clinic, and women's cooperative generating income.",
      impact: "250+ families transformed",
    },
  ];

  const achievements = [
    {
      title: "Youth Empowerment & Leadership Development",
      description: "Empowered over 2,000 youth through the annual Youth Empowerment Program (YEP), equipping them with essential skills for personal and professional growth."
    },
    {
      title: "Women's Economic Empowerment & Support",
      description: "Impacted the lives of over 800 women and widows through economic empowerment initiatives, capacity-building programs, mentorship, and counseling services. Provided 100 hybrid palm tree seedlings to women in rural communities."
    },
    {
      title: "Child Protection & Education Advocacy",
      description: "Reached over 3,000 young school children through the 'Speak Out, Speak Up' Project, raising awareness on child sexual abuse prevention. Donated sanitary pads to girls in underserved schools."
    },
    {
      title: "Support for Orphans & Vulnerable Communities",
      description: "Partnered with five orphanages to provide life skills training, food donations, computers, and the refurbishment of a digital library, enhancing learning opportunities for disadvantaged children."
    },
    {
      title: "Health Outreach for Rural Communities",
      description: "Organized free medical outreaches in rural communities, providing essential healthcare services to over 300 women, improving their well-being and access to medical care."
    },
    {
      title: "Establishment of Regamos Royal Academy",
      description: "Founded Regamos Royal Academy, a social enterprise dedicated to offering quality education to children from struggling families, underserved communities, and out-of-school children."
    },
  ];

  return (
    <>
      <SEOHead 
        title="Impact Stories"
        description="Discover real stories of transformation through Regamos Foundation. See how we've empowered widows, educated youth, and strengthened communities."
        url="https://regamosfoundation.lovable.app/impact"
      />
      <div className="min-h-screen">
        <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                Our <span className="text-primary">Impact</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed px-2">
                Real stories of transformation and lives changed through compassion and empowerment
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center space-y-2 sm:space-y-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full ${
                        stat.color === "primary" ? "bg-primary/10" : "bg-accent/10"
                      }`}
                    >
                      <stat.icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${stat.color === "primary" ? "text-primary" : "text-accent"}`} />
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Success Stories</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                Meet the people whose lives have been transformed through our programs
              </p>
            </div>

            <div className="space-y-8 sm:space-y-12 md:space-y-16 max-w-6xl mx-auto">
              {stories.map((story, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                    <div className={`relative h-56 sm:h-64 md:h-80 lg:h-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent shadow-glow">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          <span className="text-xs sm:text-sm font-semibold text-white">{story.impact}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className={`p-5 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{story.name}</h3>
                      <p className="text-primary font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{story.title}</p>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">{story.story}</p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Key Achievements</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
                  Milestones we've reached together with your support
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2">{achievement.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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

export default Impact;
