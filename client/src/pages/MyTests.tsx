import SearchBar from "../components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import { fetchTestsByUserId } from "../utils/dbUtils";
import Spinner from "../components/ui/Spinner";
import TestItem from "../components/TestItem";
import { Input } from "../components/ui/Input";

const MyTests = () => {
	const { session } = useSession();

	if (!session) {
		return;
	}

	const { data, isLoading, isError } = useQuery({
		queryKey: ["tests", session.user.id],
		queryFn: () => fetchTestsByUserId(session.user.id),
	});

	return (
		<div className="flex flex-col gap-10 p-10 pt-5 w-full">
			<SearchBar />
			<div className="max-w-7xl mx-auto flex flex-col w-full border-b border-slate-200">
				<h1 className="text-2xl font-bold text-zinc-800">My tests</h1>
				<p className="text-slate-400 text-sm pt-3 pb-3">
					Here you can manage all tests created by you.
				</p>
				
			</div>
            <div className="flex flex-col gap-2 mt-1">
                <Input placeholder="Filter tests by title..." className="bg-slate-200"/>
					{isLoading && !isError ? (
						<Spinner />
					) : (
						data?.map((test) => <TestItem test={test} session={session} />)
					)}
                    {(!isLoading && isError) && <div>Error loading tests</div>}
				</div>
		</div>
	);
};

export default MyTests;
