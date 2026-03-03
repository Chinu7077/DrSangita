import StickyHeader from "@/components/StickyHeader";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import ConsultationForm from "@/components/ConsultationForm";
import SocialSection from "@/components/SocialSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <StickyHeader />
      <HeroSection />
      <div id="about" />
      <ContactSection />
      <ConsultationForm />
      <SocialSection />
    </div>
  );
};

export default Index;
