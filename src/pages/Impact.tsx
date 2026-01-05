import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Heart, TrendingUp, Award, CheckCircle } from "lucide-react";
import digitalLibraryImg from "@/assets/impact-digital-library.jpg";
import medicalOutreachImg from "@/assets/impact-medical-outreach.jpg";
import financialLiteracyImg from "@/assets/impact-financial-literacy.jpg";
import palmSeedlingsImg from "@/assets/impact-palm-seedlings.jpg";
import menstrualHygieneImg from "@/assets/impact-menstrual-hygiene.jpg";
import communityOutreachImg from "@/assets/impact-community-outreach.jpg";
import childProtectionImg from "@/assets/impact-child-protection.jpg";
import lifeSkillsImg from "@/assets/impact-life-skills.jpg";
import hpDonationImg from "@/assets/impact-hp-donation.jpg";
import computerTrainingImg from "@/assets/impact-computer-training.jpg";
import childrensDayImg from "@/assets/impact-childrens-day.jpg";
import rocoOrphanageImg from "@/assets/impact-roco-orphanage.jpg";
import peculiarSaintImg from "@/assets/impact-peculiar-saint.jpg";

const Impact = () => {
  const stats = [
    { icon: Users, number: "2,000+", label: "Youth Empowered", color: "primary" },
    { icon: Heart, number: "800+", label: "Women & Widows Impacted", color: "accent" },
    { icon: GraduationCap, number: "3,000+", label: "Children Reached", color: "primary" },
    { icon: Award, number: "300+", label: "Medical Outreach Recipients", color: "accent" },
  ];

  const stories = [
    {
      name: "Digital Library at Arrow of God Orphanage",
      title: "Transforming Lives Through Technology",
      image: digitalLibraryImg,
      story:
        "In partnership with HP Foundation and Global Shapers, Regamos Foundation commissioned a Digital Library at the Arrow of God Orphanage. This project included digital library refurbishment, training of all children aged 12-18 years, and teacher/staff training on computer skills. The project commenced February 2021 and was successfully completed in August 2021.",
      impact: "100+ children trained",
    },
    {
      name: "Health & Wealth Initiative",
      title: "Free Medical Outreach in Mbioto 1",
      image: medicalOutreachImg,
      story:
        "As part of our Health and Wealth initiative for 300 women empowerment program in Mbioto 1, Etinan LGA, Akwa Ibom State, we organized a free medical service and drug administration at the Mbioto 1 Health Centre. The village Head and council chiefs were happy to receive the drugs donated by Regamos Foundation for the women and people of the community.",
      impact: "300+ women served",
    },
    {
      name: "Financial Literacy Empowerment",
      title: "Access Bank Partnership",
      image: financialLiteracyImg,
      story:
        "Access Bank, led by their Abuja team and Uyo office with their Regional Manager, partnered with us to empower 300 women on Financial Literacy skills during our Health and Wealth initiative. The Bank gave out free gifts, opened accounts for the women, empowered selected youth on POS business, and promised to create a POS point in the village.",
      impact: "300 women empowered",
    },
    {
      name: "Sustainable Livelihoods",
      title: "Palm Seedlings Distribution",
      image: palmSeedlingsImg,
      story:
        "Sematex LM Services led by the Managing Director, Mr. Aniefiok Ekanem, donated water packs and 100 palm seedlings to farmers during our Health and Wealth community initiative in Mbioto 1. This initiative supports Regamos Foundation's 300 women empowerment initiative by providing sustainable livelihood opportunities.",
      impact: "100 seedlings distributed",
    },
    {
      name: "Pad A Girl Project",
      title: "World Menstrual Hygiene Day",
      image: menstrualHygieneImg,
      story:
        "Regamos Foundation partnered with Visionary Women to celebrate World Menstrual Hygiene Day. We distributed 150 pads to girls at Gbangapi Secondary School, Minna, Niger State. We educated them on the importance of menstrual hygiene, how to track their menstrual cycle, and the importance of being a female child. At Regamos Foundation, our priority is to make sure that the female child sees a bright future for herself.",
      impact: "150 girls reached",
    },
    {
      name: "Community Empowerment",
      title: "Transforming Lives Together",
      image: communityOutreachImg,
      story:
        "At Regamos Foundation we are passionate about transforming lives. With the support of His Excellencies, the Deputy Governor, and the Chairman of our Advisory Board, along with the entire Regamos Foundation team, we continue to reach more communities and change lives for the better.",
      impact: "Multiple communities",
    },
    {
      name: "Speak Out Against Sexual Abuse",
      title: "Child Protection Network Campaign",
      image: childProtectionImg,
      story:
        "Regamos Foundation in celebration of the Child Protection Network (CPN) Lagos State week had a 'Speak out against sexual abuse' sensitisation campaign for Secondary School students in Ibeju Lekki, Lagos Nigeria. Joining our foundation in this sensitisation campaign was the Ibeju Lekki CPN Coordinator. The students were equipped with knowledge on how to stay safe and report incidences of sexual abuse.",
      impact: "100+ students educated",
    },
    {
      name: "Life Skills Training",
      title: "Destiny Trust Orphanage",
      image: lifeSkillsImg,
      story:
        "Life Skills Training for Orphanages at Destiny Trust Orphanage on the topic of Self Awareness. We taught 5 reasons why Self Awareness is important: Self Reflection, Strength and Weaknesses, Manage your emotions, Consider others, and Take criticism. Empowering children with essential life skills for their future.",
      impact: "20+ children trained",
    },
    {
      name: "HP Foundation Partnership",
      title: "Technology for Education",
      image: hpDonationImg,
      story:
        "Thank you Global Shapers Community, HP Foundation and Codesparks for making this a reality. Through this incredible partnership, we were able to provide computers and technology resources to support education and digital literacy for orphanages and underserved communities, transforming lives through technology.",
      impact: "Multiple computers donated",
    },
    {
      name: "Computer Training Program",
      title: "Arrow of God Orphanage",
      image: computerTrainingImg,
      story:
        "Regamos Foundation training the teachers of Arrow of God Orphanage on the basic components of the computer system. The training covered areas such as input devices and output devices processing, software, hardware and storage devices. This is the first of the three weeks training to be conducted by the foundation in Arrows of God Orphanage.",
      impact: "Teachers empowered",
    },
    {
      name: "Children's Day Celebration",
      title: "UDV Orphanage",
      image: childrensDayImg,
      story:
        "Regamos Foundation in partnership with Tee Dee Foodies and Parker's Global Foundation celebrated Children's Day with children in UDV Orphanage. The children had plenty to eat and drink. They sang, played and were celebrated. From all of us at Regamos Foundation we wish every child out there a 'Happy Children's Day'.",
      impact: "30+ children celebrated",
    },
    {
      name: "Life Skills at Roco Orphanage",
      title: "Self Awareness Module",
      image: rocoOrphanageImg,
      story:
        "Regamos Foundation life skills training program at Roco orphanage. Today's module was Self Awareness. It was an impactful session where children learned about understanding themselves and their potential. The training helps orphans develop essential skills for navigating life's challenges.",
      impact: "25+ children trained",
    },
    {
      name: "Peculiar Saint Orphanage",
      title: "Communication & Self Awareness",
      image: peculiarSaintImg,
      story:
        "We were at Peculiar Saint Orphanage to empower the children on life skills training. We taught them Communication skills and Self Awareness. It was facilitated by our Founder/Executive Director, Dr. Regina Inem and our intern, Praise from a Private University. Building foundations for brighter futures.",
      impact: "15+ children empowered",
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
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg mb-4">{story.story}</p>
                      <SocialShareButtons 
                        url={`https://regamosfoundation.lovable.app/impact#${story.name.toLowerCase().replace(/\s+/g, '-')}`}
                        title={`${story.name} - ${story.title}`}
                        description={story.story.substring(0, 120)}
                        compact
                      />
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
