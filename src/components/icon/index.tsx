"use client";

// import * as Ai from "react-icons/ai"; // Ant Design icons
// import * as Bi from "react-icons/bi"; // Boxicons
// import * as Bs from "react-icons/bs"; // Bootstrap icons

// import * as Md from "react-icons/md"; // Material Design icons
// import * as Pi from "react-icons/pi"; // Phosphor Icons
import * as Ri from "react-icons/ri"; // Remix icons

import { ReactNode } from "react";

// import * as Cg from "react-icons/cg"; // Circum icons
// import * as Ci from "react-icons/ci"; // css.gg
// import * as Di from "react-icons/di"; // Devicons
// import * as Fa from "react-icons/fa"; // Font Awesome icons
// import * as Fa6 from "react-icons/fa6"; // Font Awesome 6 icons
// import * as Fc from "react-icons/fc"; // Flat Color icons
// import * as Fi from "react-icons/fi"; // Feather icons
// import * as Gi from "react-icons/gi"; // Game Icons
// import * as Go from "react-icons/go"; // Github Octicons icons
// import * as Gr from "react-icons/gr"; // Grommet-Icons
// import * as Hi from "react-icons/hi"; // Heroicons
// import * as Hi2 from "react-icons/hi2"; // Heroicons 2
// import * as Im from "react-icons/im"; // IcoMoon Free
// import * as Io from "react-icons/io"; // Ionicons 4
// import * as Io5 from "react-icons/io5"; // Ionicons 5
// import * as Lia from "react-icons/lia"; // Icons8 Line Awesome
// import * as Lu from "react-icons/lu"; // Lucide Icons

// import * as Rx from "react-icons/rx"; // Radix Icons
// import * as Si from "react-icons/si"; // Simple Icons
// import * as Sl from "react-icons/sl"; // Simple Line Icons
// import * as Tb from "react-icons/tb"; // Tabler Icons
// import * as Tfi from "react-icons/tfi"; // Themify Icons
// import * as Ti from "react-icons/ti"; // Typicons
// import * as Vsc from "react-icons/vsc"; // VS Code icons
// import * as Wi from "react-icons/wi"; // Weather icons

// Map of prefixes to icon packages
const iconPackages: { [key: string]: any } = {
  // Ai,
  // Bs,
  // Bi,
  // Ci,
  // Cg,
  // Di,
  // Fi,
  // Fc,
  // Fa,
  // Fa6,
  // Go,
  // Gi,
  // Gr,
  // Hi,
  // Hi2,
  // Im,
  // Io,
  // Io5,
  // Lia,
  // Lu,
  // Md,
  // Pi,
  Ri,
  // Rx,
  // Si,
  // Sl,
  // Tb,
  // Tfi,
  // Ti,
  // Vsc,
  // Wi,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = '' }) => {
  const iconMap: { [key: string]: string } = {
    // 现有图标
    '1': '/imgs/icons/1.svg',
    '2': '/imgs/icons/2.svg',
    '3': '/imgs/icons/3.svg',
    '4': '/imgs/icons/4.svg',
    '5': '/imgs/icons/5.svg',
    '6': '/imgs/icons/6.svg',
    
    // 新增工具图标
    'document-polish': '/imgs/icons/document-polish.svg',
    'one-on-one-consulting': '/imgs/icons/one-on-one-consulting.svg',
    'personal-statement-write': '/imgs/icons/personal-statement-write.svg',
    'purpose-statement-write': '/imgs/icons/purpose-statement-write.svg',
    'personal-statement-polish': '/imgs/icons/personal-statement-polish.svg',
    'personal-statement-evaluate': '/imgs/icons/personal-statement-evaluate.svg',
    'sop-statement': '/imgs/icons/sop-statement.svg',
    'resume-generate': '/imgs/icons/resume-generate.svg',
    'recommendation-letter-write': '/imgs/icons/recommendation-letter-write.svg',
    'recommendation-letter-polish': '/imgs/icons/recommendation-letter-polish.svg',
    'recommendation-letter-evaluate': '/imgs/icons/recommendation-letter-evaluate.svg',
  };

  const iconSrc = iconMap[name];

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <img
      src={iconSrc}
      alt={name}
      width={size}
      height={size}
      className={`inline-block ${className}`}
    />
  );
};

export default Icon;
