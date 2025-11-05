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
    { icon: Users, number: "500+", label: "Widows Empowered", color: "primary" },
    { icon: GraduationCap, number: "1000+", label: "Youth Trained", color: "accent" },
    { icon: Heart, number: "50+", label: "Communities Reached", color: "primary" },
    { icon: Award, number: "200+", label: "Scholarships Awarded", color: "accent" },
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
    "Established 10 vocational training centers",
    "Distributed over 2,000 school supplies kits",
    "Provided medical outreach to 5,000+ individuals",
    "Created 150+ sustainable small businesses",
    "Trained 500+ women in various vocational skills",
    "Placed 300+ youth in employment or internships",
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
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold">
                Our <span className="text-primary">Impact</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Real stories of transformation and lives changed through compassion and empowerment
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                        stat.color === "primary" ? "bg-primary/10" : "bg-accent/10"
                      }`}
                    >
                      <stat.icon className={`h-8 w-8 ${stat.color === "primary" ? "text-primary" : "text-accent"}`} />
                    </div>
                    <div className="text-5xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the people whose lives have been transformed through our programs
              </p>
            </div>

            <div className="space-y-16 max-w-6xl mx-auto">
              {stories.map((story, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                    <div className={`relative h-80 lg:h-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                      <div className="absolute bottom-8 left-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent shadow-glow">
                          <TrendingUp className="h-4 w-4 text-white" />
                          <span className="text-sm font-semibold text-white">{story.impact}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                      <h3 className="text-3xl font-bold mb-2">{story.name}</h3>
                      <p className="text-primary font-semibold mb-4">{story.title}</p>
                      <p className="text-muted-foreground leading-relaxed text-lg">{story.story}</p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Key Achievements</h2>
                <p className="text-lg text-muted-foreground">
                  Milestones we've reached together with your support
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-soft hover:shadow-glow transition-smooth animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6 flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                      <p className="text-lg">{achievement}</p>
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
