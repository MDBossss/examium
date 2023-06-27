import { useSession } from "@clerk/clerk-react";
import LoginButton from "./ui/LoginButton";
import { TestType } from "../types/models";

interface Props{
	setTest?: (test:TestType) => void;
	test?: TestType
}

const SearchBar = ({test,setTest}:Props) => {
	const { session } = useSession();

	return (
		<div className="flex flex-row gap-3 items-center justify-end">
			{session && <p>Welcome,  <span className=" text-blue-500">{session.user.firstName}</span></p>}
			<LoginButton test={test} setTest={setTest}/>
		</div>
	);
};

export default SearchBar;
