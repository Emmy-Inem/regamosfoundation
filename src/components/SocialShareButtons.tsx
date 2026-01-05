import { Button } from "@/components/ui/button";
import { Facebook, Twitter, MessageCircle, Linkedin, Link2 } from "lucide-react";
import { toast } from "sonner";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  compact?: boolean;
}

const SocialShareButtons = ({ url, title, description = "", compact = false }: SocialShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (compact) {
    return (
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-[#1877F2]/10 hover:text-[#1877F2]"
          onClick={() => window.open(shareLinks.facebook, "_blank", "width=600,height=400")}
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
          onClick={() => window.open(shareLinks.twitter, "_blank", "width=600,height=400")}
          title="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-[#25D366]/10 hover:text-[#25D366]"
          onClick={() => window.open(shareLinks.whatsapp, "_blank")}
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted"
          onClick={handleCopyLink}
          title="Copy link"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm text-muted-foreground self-center mr-2">Share:</span>
      <Button
        variant="outline"
        size="sm"
        className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-0"
        onClick={() => window.open(shareLinks.facebook, "_blank", "width=600,height=400")}
      >
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-0"
        onClick={() => window.open(shareLinks.twitter, "_blank", "width=600,height=400")}
      >
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-[#25D366] hover:bg-[#25D366]/90 text-white border-0"
        onClick={() => window.open(shareLinks.whatsapp, "_blank")}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white border-0"
        onClick={() => window.open(shareLinks.linkedin, "_blank", "width=600,height=400")}
      >
        <Linkedin className="h-4 w-4 mr-2" />
        LinkedIn
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopyLink}>
        <Link2 className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
};

export default SocialShareButtons;
