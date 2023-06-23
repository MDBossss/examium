import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SearchBar = () => {
	let user = {
		fullName: "John Doe",
	};

	return (
		<div className="flex flex-row gap-5 items-center justify-end">
			<p>{user ? user.fullName : "Log In"}</p>
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		</div>
	);
};

export default SearchBar;
