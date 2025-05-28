'use client';

type Feature = {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  isSpecial?: boolean;
  specialIcon?: JSX.Element;
};

const features: Feature[] = [
  {
    title: "Real-time Sync",
    description: "Changes appear instantly across all connected devices",
    color: "primary",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "File Sharing",
    description: "Upload and share files seamlessly across all connected devices",
    color: "blue-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    )
  },
  {
    title: "Password Protection",
    description: "Add an extra layer of security with password-protected clipboards",
    color: "purple-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
      </svg>
    )
  },
  {
    title: "No Login Required",
    description: "Just create or join a clipboard with a 4-digit code",
    color: "secondary",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },

  {
    title: "24-Hour Storage",
    description: "Clipboards automatically expire after 24 hours of inactivity and all data are deleted from our server",
    color: "accent",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "End-to-End Encrypted",
    description: "Your clipboard data is fully encrypted and secure",
    color: "emerald-500",
    isSpecial: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    specialIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

export default function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Section Title */}
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Powerful Features</h2>
        <p className="text-text-secondary mt-2 max-w-2xl mx-auto">Everything you need for seamless clipboard sharing</p>
      </div>
      {/* First four features in a 4-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.slice(0, 4).map((feature, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border border-surface-hover bg-surface/50 backdrop-blur-sm ${feature.isSpecial ? 'relative overflow-hidden group' : ''}`}
          >
            {feature.isSpecial && (
              <div className="absolute -right-6 -top-6 w-12 h-12 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            )}
            <div className={`w-10 h-10 bg-${feature.color}/10 rounded-full flex items-center justify-center mb-3 ${feature.isSpecial ? 'relative z-10' : ''}`}>
              <span className={`text-${feature.color}`}>{feature.icon}</span>
            </div>
            <h3 className={`text-lg font-medium text-text-primary mb-1 ${feature.isSpecial ? 'relative z-10' : ''}`}>{feature.title}</h3>
            <p className={`text-text-secondary text-sm ${feature.isSpecial ? 'relative z-10' : ''}`}>{feature.description}</p>
            {feature.isSpecial && feature.specialIcon && (
              <div className="absolute bottom-1 right-1">
                {feature.specialIcon}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Last two features centered in the middle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto w-full">
        {features.slice(4).map((feature, index) => (
          <div
            key={index + 4}
            className="p-4 rounded-lg border border-surface-hover bg-surface/50 backdrop-blur-sm"
          >
            <div className={`w-10 h-10 bg-${feature.color}/10 rounded-full flex items-center justify-center mb-3`}>
              <span className={`text-${feature.color}`}>{feature.icon}</span>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-1">{feature.title}</h3>
            <p className="text-text-secondary text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
