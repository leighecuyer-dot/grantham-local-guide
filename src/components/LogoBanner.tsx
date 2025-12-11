import discoverLocalLogo from "@/assets/discover-local-logo.png";

interface LogoBannerProps {
  showTagline?: boolean;
}

const LogoBanner = ({ showTagline = true }: LogoBannerProps) => {
  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-r from-primary/10 via-card to-primary/10 border-b border-primary/20">
      <div className="w-full flex flex-col items-center px-4">
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
            Your guide to local businesses
          </p>
        )}
      </div>
    </section>
  );
};

export default LogoBanner;