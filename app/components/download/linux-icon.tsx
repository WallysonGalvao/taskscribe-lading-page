import type { HTMLAttributes } from "react";
import Image from "next/image";

export function LinuxIcon({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      <Image
        src="/linux-24.png"
        alt="Linux"
        width={24}
        height={24}
        className="w-full h-full"
      />
    </div>
  );
}
