import { Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

const socials = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/drsangitakumarinayak/",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/sangitakumari.nayak.583",
  },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/" },
  { icon: Twitter, label: "X (Twitter)", href: "https://x.com/" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/" },
];

const SocialSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-md mx-auto text-center">
        <p className="text-sm font-medium text-primary uppercase tracking-wide mb-2">
          Follow Us
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Stay Connected
        </h2>

        <div className="flex justify-center gap-4 flex-wrap">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="social-icon"
            >
              <s.icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dr. Sangita Kumari Nayak • BHMS • All
            rights reserved
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
