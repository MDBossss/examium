interface Props{
    className?:string
}

const LogoSquare = ({className}:Props) => {
	return <img src="/logo-small.png" alt="logo" className={`w-[40px] ${className}`}/>;
};

export default LogoSquare;
