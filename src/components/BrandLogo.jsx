import mainLogo from "../assets/MainBBLogo.png";

export default function BrandLogo({ className = "" }) {
  return (
    <>
      <img
        src={mainLogo}
        alt="Binary Baker"
        className={`h-12 w-auto max-w-[190px] object-contain sm:h-14 ${className}`}
      />
      <span className="sr-only">Binary Baker</span>
    </>
  );
}
