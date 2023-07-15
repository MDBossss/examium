interface Props{
  className?: string
}

const Logo = ({ className }:Props) => {
  return <img src="/logo.png" alt="logo" className={`w-[180px] ${className}`} />;
};

export default Logo;
