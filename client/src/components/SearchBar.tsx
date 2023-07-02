import { useSession } from "@clerk/clerk-react";
import LoginButton from "./ui/LoginButton";
import { TestType } from "../types/models";

interface Props {
	setTest?: (test: TestType) => void;
	test?: TestType;
}

const SearchBar = ({ test, setTest }: Props) => {
	const { session } = useSession();
	const date = new Date();

	return (
		<div className="flex flex-row gap-3 items-center justify-between">
			<div>
				<p className="text-sm text-slate-400">
					{date.toLocaleDateString(undefined, {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
			</div>
			<div className="flex gap-3 items-center">
				{session && (
					<p>
						Welcome, <span className=" text-blue-500">{session.user.firstName}</span>
					</p>
				)}
				<LoginButton test={test} setTest={setTest} />
			</div>
		</div>
	);
};

export default SearchBar;
