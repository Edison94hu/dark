import { useState } from "react";
import { User } from "lucide-react";

interface ContextBarProps {
  companyName: string;
  companyLogoUrl?: string;
  operatorName: string;
  className?: string;
  dark?: boolean;
  onCompanyClick?: () => void;
  onOperatorClick?: () => void;
}

export function ContextBar({
  companyName,
  companyLogoUrl,
  operatorName,
  className = "",
  dark = false,
  onCompanyClick,
  onOperatorClick,
}: ContextBarProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Generate letter avatar from company name
  const generateLetterAvatar = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
  };

  const companyLetters = generateLetterAvatar(companyName);

  const baseClasses = `
    relative rounded-[12px] px-4 py-3 transition-all duration-[120ms] ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-safety-green/40 focus:ring-offset-2
    bg-transparent hover:bg-accent/30 active:bg-accent/50 focus:ring-offset-background
    ${isPressed ? 'scale-[0.998]' : ''}
    ${className}
  `;



  return (
    <div 
      className={baseClasses}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      tabIndex={0}
      role="banner"
      aria-label="Operation context information"
    >
      {/* Content Grid - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 lg:gap-6 items-center min-h-[44px]">
        
        {/* Company Section - Left Side on Large Screens */}
        <div 
          className="lg:col-span-7 min-w-0 flex items-center gap-3 cursor-pointer lg:min-h-[44px]"
          onClick={onCompanyClick}
          tabIndex={0}
          role="button"
          aria-label={`Company: ${companyName}`}
          title={companyName}
        >
          {/* Company Logo/Avatar */}
          <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-muted">
            {companyLogoUrl ? (
              <img 
                className="h-8 w-8 rounded-full object-cover" 
                src={companyLogoUrl} 
                alt=""
                loading="lazy"
              />
            ) : (
              <span className="text-[14px] font-semibold select-none text-foreground">
                {companyLetters}
              </span>
            )}
          </div>

          {/* Company Name - Larger and more prominent */}
          <div 
            className="truncate text-[18px] font-semibold min-w-0 flex-1 text-foreground"
            title={companyName}
          >
            {companyName}
          </div>
        </div>

        {/* Operator Section - Right Side on Large Screens */}
        <div 
          className="lg:col-span-4 min-w-0 flex items-center justify-start lg:justify-end gap-3 cursor-pointer lg:min-h-[44px]"
          onClick={onOperatorClick}
          tabIndex={0}
          role="button"
          aria-label={`Operator: ${operatorName}`}
          title={operatorName}
        >
          {/* Operator Name - Smaller and secondary */}
          <div 
            className="truncate text-[13px] lg:text-right min-w-0 flex-1 lg:flex-initial order-1 lg:order-none text-muted-foreground"
            title={operatorName}
          >
            {operatorName}
          </div>

          {/* Operator Icon - Slightly smaller */}
          <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 order-0 lg:order-none bg-muted">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

      </div>
    </div>
  );
}