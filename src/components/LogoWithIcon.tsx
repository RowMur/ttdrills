"use client";

import Image from "next/image";

interface LogoWithIconProps {
  className?: string;
  showIcon?: boolean;
}

export const LogoWithIcon = ({
  className = "",
  showIcon = true,
}: LogoWithIconProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <div className={`relative`}>
          <Image
            src="/logo.png"
            alt="TTDrills Logo"
            width={150}
            height={30}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
};
