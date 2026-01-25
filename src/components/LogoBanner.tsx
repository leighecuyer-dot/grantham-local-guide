import discoverLocalLogo from "@/assets/discover-local-logo.png";
import granthamSkyline from "@/assets/grantham-skyline.jpg";

interface LogoBannerProps {
  showTagline?: boolean;
}

const LogoBanner = ({ showTagline = true }: LogoBannerProps) => {
  return (
    <section className="relative w-full py-16 md:py-20 lg:py-24 border-b border-primary/20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${granthamSkyline})` }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/85 to-background/90" />
      
      <div className="relative z-10 w-full flex flex-col items-center px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-110 animate-pulse" />
          <img 
            src={discoverLocalLogo} 
            alt="Discover Local Grantham" 
            className="relative h-48 md:h-64 lg:h-80 xl:h-96 max-w-full object-contain drop-shadow-2xl opacity-0 animate-fade-in"
          />
        </div>
        {showTagline && (
          <p className="mt-6 md:mt-8 text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium tracking-wide opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Your guide to Grantham's Businesses
          </p>
        )}
      </div>
    </section>
  );
};

export default LogoBanner;