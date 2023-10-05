import SearchBar from "../components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import { fetchTestsByUserId } from "../api/tests";
import Spinner from "../components/ui/Spinner";
import TestItem from "../components/TestItem";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useCallback, useState } from "react";
import { TestType } from "../types/models";
import { notEmpty } from "../utils/genericUtils";

const MyTests = () => {
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
		queryKey: ["tests", userId],
		queryFn: () => fetchTestsByUserId(userId!),
		select: filterTestsByTitle,
		refetchOnWindowFocus: false,
		enabled: !!userId,
	});


	return (
		<div className="flex flex-col w-full gap-10 p-4 pt-5 max-w-screen sm:p-10">
			<SearchBar />
			<div className="w-full mx-auto max-w-7xl">
				<div className="flex flex-col mb-10 text-center border-b border-slate-200 dark:border-gray-800 sm:text-left">
					<h1 className="text-2xl font-bold">My tests</h1>
					<p className="pt-3 pb-3 text-sm text-slate-400">
						Here you can manage all tests created by you.
					</p>
				</div>
				<div className="flex flex-col gap-2 mt-1">
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
						<div className="flex justify-center p-5">You have no tests 😅</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MyTests;
