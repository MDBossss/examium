import { useSession } from "@clerk/clerk-react";
import { useState, useCallback } from "react";
import { TestType } from "../../../shared/models";
import { useQuery } from "@tanstack/react-query";
import { fetchCollaborationTestsByUserId } from "../api/tests";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import TestItem from "../components/TestItem";
import { notEmpty } from "../utils/genericUtils";

const Collaborations = () => {
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
		<>
			<div className="w-full">
				<div className="flex flex-col mb-10 text-center border-b border-slate-200 dark:border-gray-800 sm:text-left">
					<h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Collaborations</h1>
					<p className="pt-3 pb-3 text-sm text-slate-400">
						Here you can see all tests where you are a collaborator.
					</p>
				</div>
				<div className="flex flex-col gap-2 mx-auto mt-1 max-w-7xl">
					<div className="flex gap-2">
						<Input
							placeholder="Filter tests by title..."
							onChange={(e) => setFilterTitle(e.target.value)}
						/>
						<Button variant="outline" className="hover:bg-slate-200">
							Filter
						</Button>
					</div>
					{isLoading && !isError ? (
						<Spinner className="flex justify-center p-5" />
					) : (
						data?.map((test) => <TestItem key={test.id} test={test} />)
					)}
					{isError && <div className="flex justify-center p-5">Error loading tests 😓</div>}
					{data && !notEmpty(data) && (
						<div className="flex justify-center p-5">You have no collaborations 😅</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Collaborations;
