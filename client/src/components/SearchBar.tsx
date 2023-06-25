import { useSession } from "@clerk/clerk-react";
import LoginButton from "./ui/LoginButton";

const SearchBar = () => {
	const { session } = useSession();

	return (
		<div className="flex flex-row gap-3 items-center justify-end">
			{session && <p>Welcome,  <span className=" text-blue-500">{session.user.firstName}</span></p>}
			<LoginButton />
		</div>
	);
};

export default SearchBar;
