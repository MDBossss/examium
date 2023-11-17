import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface NavItemType {
	location: string;
	title: string;
	icon: JSX.Element;
	subItems?: { title: string; location: string }[];
}

interface Props {
	item: NavItemType;
	handleNavigate: (path: string) => void;
}

const SidebarItem = ({ item, handleNavigate }: Props) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	return (
		<li key={item.title}>
			{item.subItems ? (
				<ul className="flex flex-col gap-1">
					<div
						className={` flex justify-between font-medium items-center gap-3 p-2 text-md transition-all rounded-sm cursor-pointer hover:bg-slate-300 dark:hover:bg-gray-800`}
						onClick={() => setIsDropdownOpen((prev) => !prev)}
					>
						<div className="flex gap-3">
							<span className="text-gray-500">{item.icon}</span>
							<p>{item.title}</p>
						</div>
						{isDropdownOpen ? <ChevronUpIcon className="text-gray-500"/> : <ChevronDownIcon className="text-gray-500"/> }
					</div>
					{isDropdownOpen && item.subItems.map((subItem) => (
						<li
							className={`${
								location.pathname.includes(subItem.location) && "bg-slate-300 dark:bg-gray-800 "
							} pl-11 flex text-md font-medium items-center gap-3 p-1 text-md transition-all rounded-sm cursor-pointer hover:bg-slate-300 dark:hover:bg-gray-800`}
                            onClick={() => handleNavigate(subItem.location)}
						>
							{subItem.title}
						</li>
					))}
				</ul>
			) : (
				<div
					className={`${
						location.pathname.includes(item.location) && "bg-slate-300 dark:bg-gray-800 "
					} flex font-medium items-center gap-3 p-2 text-md transition-all rounded-sm cursor-pointer hover:bg-slate-300 dark:hover:bg-gray-800`}
					onClick={() => handleNavigate(item.location)}
				>
					<span
						className={`${
							location.pathname.includes(item.location)
								? "dark:text-slate-300"
								: "dark:text-gray-500"
						}`}
					>
						{item.icon}
					</span>
					{item.title}
				</div>
			)}
		</li>
	);
};

export default SidebarItem;
