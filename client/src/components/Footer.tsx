import { GithubIcon } from "lucide-react";

const Footer = () => {
	return (
		<div className="bottom-0 fixed w-full flex justify-between items-center px-2 sm:px-10 py-2 bg-zinc-800">
			<p className="text-sm text-slate-200">&copy; All rights reserved</p>
			<a href="https://github.com/MDBossss/examium" target="_blank">
				<GithubIcon className="w-7 h-7 rounded-full cursor-pointer text-slate-200 hover:bg-zinc-700 p-1" />
			</a>
		</div>
	);
};

export default Footer;
