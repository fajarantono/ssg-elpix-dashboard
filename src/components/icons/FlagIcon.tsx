import Image from "next/image";

interface FlagIconProps {
  countryCode: string;
  className?: string;
  size?: number;
}

export default function FlagIcon({
  countryCode,
  className,
  size = 24,
}: FlagIconProps) {
  return (
    <>
      <Image
        src={`/images/flags/${countryCode.toLowerCase()}.svg`}
        alt={`${countryCode.toUpperCase()} Flag`}
        width={size}
        height={size}
        className={className}
      />
    </>
  );
}
