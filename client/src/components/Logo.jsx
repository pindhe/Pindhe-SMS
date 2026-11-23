const Logo = ({ className = 'h-10 w-10' }) => (
  <span className={`brand-mark ${className}`} role="img" aria-label="Pindhe SMS">
    <img src="/logo.png" alt="" className="brand-mark__image" draggable="false" />
  </span>
);

export default Logo;
