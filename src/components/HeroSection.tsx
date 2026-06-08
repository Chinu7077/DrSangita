import { ArrowDown, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/theme";

const HeroSection = () => {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const scrollToContact = () => {
    document
      .querySelector("#consultation")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-6xl mx-auto w-full">

        {/* Theme Toggle */}
        <div className="fixed top-24 right-6 z-50">
          <button
            onClick={toggle}
            className="
              h-12 w-12 rounded-full
              border border-border
              bg-card
              shadow-lg
              flex items-center justify-center
              hover:scale-110
              transition-all duration-300
            "
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

          {/* Content */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <p className="text-sm sm:text-base font-medium text-primary tracking-wider uppercase mb-3 animate-fade-up">
              Homeopathy Specialist
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5 animate-fade-up">
              Healing in a
              <span className="block text-primary">
                Holistic Way
              </span>
            </h1>

            <blockquote className="text-base sm:text-lg text-muted-foreground italic border-l-4 border-primary/40 pl-4 mb-6 animate-fade-up">
              "The highest ideal of cure is the rapid, gentle, and permanent
              restoration of health."
              <span className="block text-xs mt-2 not-italic text-muted-foreground/70">
                — Samuel Hahnemann
              </span>
            </blockquote>

            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0 animate-fade-up">
              With over 7 years of experience in classical homeopathy, I
              provide personalized treatment plans that address the root cause
              of health concerns naturally and holistically.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start flex-wrap animate-fade-up">
              <button
                onClick={scrollToContact}
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Book Consultation
              </button>

             
            </div>
          </div>

          {/* Doctor Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-6 bg-primary/15 dark:bg-primary/20 rounded-3xl blur-3xl" />

              {/* Image Card */}
              <div className="relative bg-card border border-border rounded-3xl p-4 shadow-xl">
                <img
                  src="/sangp.png"
                  alt="Dr. Sangita Kumari Nayak"
                  className="w-64 sm:w-72 md:w-80 lg:w-96 object-contain rounded-2xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;