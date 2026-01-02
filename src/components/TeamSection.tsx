import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const TeamSection = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Our Team</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Meet the dedicated individuals working to make a difference in our communities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt={member.full_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl text-muted-foreground">
                      {member.full_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="font-semibold text-lg sm:text-xl mb-1">{member.full_name}</h3>
                <p className="text-xs sm:text-sm text-primary mb-2 sm:mb-3">{member.role}</p>
                
                {member.bio && (
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                )}
                
                {member.social_links && typeof member.social_links === 'object' && (
                  <div className="flex gap-2 sm:gap-3">
                    {(member.social_links as any).facebook && (
                      <a
                        href={(member.social_links as any).facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                      </a>
                    )}
                    {(member.social_links as any).twitter && (
                      <a
                        href={(member.social_links as any).twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                      </a>
                    )}
                    {(member.social_links as any).linkedin && (
                      <a
                        href={(member.social_links as any).linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                      </a>
                    )}
                    {(member.social_links as any).instagram && (
                      <a
                        href={(member.social_links as any).instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
