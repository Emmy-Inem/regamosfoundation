// Central registry of every editable image on the public website.
// Each entry has a stable key stored in `site_content` (content_type = 'image').
// Admins can override the bundled default with any uploaded image.

import heroBg from "@/assets/hero-bg.jpg";
import homeEducation from "@/assets/home-education.jpg";
import homeEmpowerment from "@/assets/home-empowerment.jpg";
import homeCommunity from "@/assets/home-community.jpg";
import homeYouth from "@/assets/home-youth.jpg";
import blogEducation from "@/assets/blog-education.jpg";
import blogEmpowerment from "@/assets/blog-empowerment.jpg";
import blogCommunity from "@/assets/blog-community.jpg";
import programsEducation from "@/assets/education.jpg";
import programsEmpowerment from "@/assets/empowerment.jpg";
import programsCommunity from "@/assets/community.jpg";
import impactDigitalLibrary from "@/assets/impact-digital-library.jpg";
import impactMedicalOutreach from "@/assets/impact-medical-outreach.jpg";
import impactFinancialLiteracy from "@/assets/impact-financial-literacy.jpg";
import impactPalmSeedlings from "@/assets/impact-palm-seedlings.jpg";
import impactMenstrualHygiene from "@/assets/impact-menstrual-hygiene.jpg";
import impactCommunityOutreach from "@/assets/impact-community-outreach.jpg";
import impactChildProtection from "@/assets/impact-child-protection.jpg";
import impactLifeSkills from "@/assets/impact-life-skills.jpg";
import impactHpDonation from "@/assets/impact-hp-donation.jpg";
import impactComputerTraining from "@/assets/impact-computer-training.jpg";
import impactChildrensDay from "@/assets/impact-childrens-day.jpg";
import impactRocoOrphanage from "@/assets/impact-roco-orphanage.jpg";
import impactPeculiarSaint from "@/assets/impact-peculiar-saint.jpg";
import donateHero from "@/assets/pages/donate-hero.jpg";
import volunteerHero from "@/assets/pages/volunteer-hero.jpg";
import partnerHero from "@/assets/pages/partner-hero.jpg";
import membershipHero from "@/assets/pages/membership-hero.jpg";
import contactHero from "@/assets/pages/contact-hero.jpg";

export interface SiteImageDef {
  key: string;
  label: string;
  group: string;
  /** Where it appears, shown to admins */
  location: string;
  fallback: string;
}

export const SITE_IMAGES: SiteImageDef[] = [
  { key: "home.hero", label: "Homepage hero background", group: "Homepage", location: "Top of the homepage", fallback: heroBg },
  { key: "home.program.education", label: "Education program card", group: "Homepage", location: "Programs section", fallback: homeEducation },
  { key: "home.program.empowerment", label: "Empowerment program card", group: "Homepage", location: "Programs section", fallback: homeEmpowerment },
  { key: "home.program.community", label: "Community program card", group: "Homepage", location: "Programs section", fallback: homeCommunity },
  { key: "home.program.youth", label: "Youth program card", group: "Homepage", location: "Programs section", fallback: homeYouth },

  { key: "blog.fallback.empowerment", label: "Blog fallback — empowerment", group: "Blog", location: "Posts without a cover image", fallback: blogEmpowerment },
  { key: "blog.fallback.education", label: "Blog fallback — education", group: "Blog", location: "Posts without a cover image", fallback: blogEducation },
  { key: "blog.fallback.community", label: "Blog fallback — community", group: "Blog", location: "Posts without a cover image", fallback: blogCommunity },

  { key: "programs.education", label: "Education pillar", group: "Programs page", location: "Programs page cards", fallback: programsEducation },
  { key: "programs.empowerment", label: "Empowerment pillar", group: "Programs page", location: "Programs page cards", fallback: programsEmpowerment },
  { key: "programs.community", label: "Community pillar", group: "Programs page", location: "Programs page cards", fallback: programsCommunity },

  { key: "impact.digital-library", label: "Digital library", group: "Impact page", location: "Impact highlights", fallback: impactDigitalLibrary },
  { key: "impact.medical-outreach", label: "Medical outreach", group: "Impact page", location: "Impact highlights", fallback: impactMedicalOutreach },
  { key: "impact.financial-literacy", label: "Financial literacy", group: "Impact page", location: "Impact highlights", fallback: impactFinancialLiteracy },
  { key: "impact.palm-seedlings", label: "Palm seedlings", group: "Impact page", location: "Impact highlights", fallback: impactPalmSeedlings },
  { key: "impact.menstrual-hygiene", label: "Menstrual hygiene", group: "Impact page", location: "Impact highlights", fallback: impactMenstrualHygiene },
  { key: "impact.community-outreach", label: "Community outreach", group: "Impact page", location: "Impact highlights", fallback: impactCommunityOutreach },
  { key: "impact.child-protection", label: "Child protection", group: "Impact page", location: "Impact highlights", fallback: impactChildProtection },
  { key: "impact.life-skills", label: "Life skills", group: "Impact page", location: "Impact highlights", fallback: impactLifeSkills },
  { key: "impact.hp-donation", label: "HP donation", group: "Impact page", location: "Impact highlights", fallback: impactHpDonation },
  { key: "impact.computer-training", label: "Computer training", group: "Impact page", location: "Impact highlights", fallback: impactComputerTraining },
  { key: "impact.childrens-day", label: "Children's day", group: "Impact page", location: "Impact highlights", fallback: impactChildrensDay },
  { key: "impact.roco-orphanage", label: "ROCO orphanage", group: "Impact page", location: "Impact highlights", fallback: impactRocoOrphanage },
  { key: "impact.peculiar-saint", label: "Peculiar Saint", group: "Impact page", location: "Impact highlights", fallback: impactPeculiarSaint },

  { key: "page.donate.hero", label: "Donate hero", group: "Action pages", location: "Donate page", fallback: donateHero },
  { key: "page.volunteer.hero", label: "Volunteer hero", group: "Action pages", location: "Volunteer page", fallback: volunteerHero },
  { key: "page.partner.hero", label: "Partner hero", group: "Action pages", location: "Partner page", fallback: partnerHero },
  { key: "page.membership.hero", label: "Membership hero", group: "Action pages", location: "Membership page", fallback: membershipHero },
  { key: "page.contact.hero", label: "Contact hero", group: "Action pages", location: "Contact page", fallback: contactHero },
];

export const SITE_IMAGE_MAP: Record<string, SiteImageDef> = Object.fromEntries(
  SITE_IMAGES.map((i) => [i.key, i])
);

/** Storage key used in the site_content table */
export const siteImageContentKey = (key: string) => `image.${key}`;

export const defaultSiteImage = (key: string) => SITE_IMAGE_MAP[key]?.fallback ?? "";
