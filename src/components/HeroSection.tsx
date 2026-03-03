import { ArrowDown } from "lucide-react";


const HeroSection = () => {
  const scrollToContact = () => {
    document
      .querySelector("#consultation")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="gradient-hero min-h-screen flex items-center pt-20 pb-12 section-padding"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <p className="animate-fade-up text-sm sm:text-base font-medium text-primary tracking-wide uppercase mb-3">
              Homeopathy Specialist
            </p>
            <h2 className="animate-fade-up-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5">
              Healing the Natural Way
            </h2>
            <blockquote className="animate-fade-up-delay-2 text-base sm:text-lg text-muted-foreground italic border-l-4 border-primary/40 pl-4 mb-6">
              "The highest ideal of cure is the rapid, gentle, and permanent
              restoration of health."
              <span className="block text-xs mt-1 not-italic text-muted-foreground/70">
                — Samuel Hahnemann
              </span>
            </blockquote>
            <p className="animate-fade-up-delay-2 text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
              With over 10 years of experience in classical homeopathy, I
              provide personalized treatment plans that address the root cause
              of your health concerns — naturally and holistically.
            </p>
            <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={scrollToContact}
                className="gradient-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Book Consultation
              </button>
              <button
                onClick={() =>
                  document
                    .querySelector("#about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium border border-border hover:bg-secondary transition-all duration-300"
              >
                Learn More <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Doctor Image */}
          <div className="order-1 md:order-2 flex justify-center animate-fade-up">
            <div className="relative">
              <div className="absolute -inset-4 gradient-primary opacity-10 rounded-3xl blur-2xl" />

              <img
                src="/DrSangita.png"
                alt="Dr. Sangita Kumari Nayak, Homeopathy Specialist"
                className="relative w-56 sm:w-64 md:w-80 lg:w-96 rounded-3xl shadow-xl object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
