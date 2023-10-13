import { GithubIcon } from "lucide-react";

const Footer = () => {
	return (
		<footer className="fixed bottom-0 flex items-center justify-between w-full px-2 py-2 bg-blue-700 sm:px-10">
			<p className="text-sm text-slate-200">&copy; All rights reserved</p>
			<a href="https://github.com/MDBossss/examium" target="_blank">
				<GithubIcon className="p-1 rounded-full cursor-pointer w-7 h-7 text-slate-200" />
			</a>
		</footer>
	);
};

export default Footer;
