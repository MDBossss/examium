import { useSession } from "@clerk/clerk-react";
import { useState, useCallback } from "react";
import { TestType } from "../types/models";
import { useQuery } from "@tanstack/react-query";
import { fetchCollaborationTestsByUserId } from "../utils/dbUtils";
import SearchBar from "../components/SearchBar";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import TestItem from "../components/TestItem";

const CollabTests = () => {
	const { session } = useSession();
	const userId = session?.user.id;
	const [filterTitle, setFilterTitle] = useState<string>("");

	const filterTestsByTitle = useCallback(
		(tests: TestType[]) => {
			if (!filterTitle) return tests;
			return tests.filter((test) => test.title.toLowerCase().includes(filterTitle));
		},
		[filterTitle]
	);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["collaborations", userId],
		queryFn: () => fetchCollaborationTestsByUserId(userId!),
		select: filterTestsByTitle,
		refetchOnWindowFocus: false,
		enabled: !!userId,
	});


	return (
		<div className="flex flex-col gap-10 p-10 pt-5 w-full">
			<SearchBar />
			<div className="max-w-7xl mx-auto w-full">
				<div className="flex flex-col  border-b border-slate-200 mb-10">
					<h1 className="text-2xl font-bold text-zinc-800">Collaborations</h1>
					<p className="text-slate-400 text-sm pt-3 pb-3">
						Here you can see all tests where you are a collaborator.
					</p>
				</div>
				<div className="flex flex-col gap-2 mt-1">
					<div className="flex gap-2">
						<Input
							placeholder="Filter tests by title..."
							className="bg-slate-200"
							onChange={(e) => setFilterTitle(e.target.value)}
						/>
						<Button variant="outline" className="hover:bg-slate-200">
							Filter
						</Button>
					</div>
					{isLoading && !isError ? (
						<Spinner />
					) : (
						data?.map((test) => <TestItem key={test.id} test={test}/>)
					)}
					{!isLoading && isError && <div>Error loading tests</div>}
				</div>
			</div>
		</div>
	);
};

export default CollabTests;
