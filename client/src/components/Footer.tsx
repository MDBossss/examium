import { GithubIcon } from "lucide-react";

const Footer = () => {
	return (
		<div className="fixed bottom-0 flex items-center justify-between w-full px-2 py-2 sm:px-10 bg-zinc-800 dark:bg-blue-700">
			<p className="text-sm text-slate-200">&copy; All rights reserved</p>
			<a href="https://github.com/MDBossss/examium" target="_blank">
				<GithubIcon className="p-1 rounded-full cursor-pointer w-7 h-7 text-slate-200 hover:bg-zinc-700" />
			</a>
		</div>
	);
};

export default Footer;
