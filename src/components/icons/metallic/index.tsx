import {
  // Sidebar icons
  SquarePen,        // For creation center
  FileText,         // For my documents
  PlaySquare,       // For order history  
  CreditCard,       // For pricing
  Coins,            // For my credits
  
  // Creation center icons
  User,             // For personal statement
  Users,            // For consulting
  Target,           // For SOP
  Mail,             // For cover letter
  Award,            // For recommendation
  UserSquare,       // For resume
} from "lucide-react";

// Icon component that selects the right icon based on name
export function MetallicIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const iconProps = { className, style };
  
  switch (name) {
    // Sidebar icons
    case "RiEditBoxLine":
      return <SquarePen {...iconProps} />;
    case "RiFileTextLine":
      return <FileText {...iconProps} />;
    case "RiOrderPlayLine":
      return <PlaySquare {...iconProps} />;
    case "RiBankCardLine":
      return <CreditCard {...iconProps} />;
    case "RiMoneyCnyCircleFill":
      return <Coins {...iconProps} />;
    
    // Creation center icons
    case "personal-statement-write":
      return <User {...iconProps} />;
    case "one-on-one-consulting":
      return <Users {...iconProps} />;
    case "sop-statement":
      return <Target {...iconProps} />;
    case "document-polish":
      return <Mail {...iconProps} />;
    case "recommendation-letter-write":
      return <Award {...iconProps} />;
    case "resume-generate":
      return <UserSquare {...iconProps} />;
    
    default:
      return null;
  }
}