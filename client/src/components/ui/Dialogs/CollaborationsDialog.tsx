import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./Dialog";
import { UsersIcon } from "lucide-react";
import { Button } from "../Button";
import { TestType } from "../../../../../shared/models";
import { Input } from "../Input";
import CollaboratorsTable from "../../CollaboratorsTable";
import { useState } from "react";
import { z } from "zod";
import { useToast } from "../../../hooks/useToast";
import { fetchUserByEmail } from "../../../api/users";
import { ActiveSessionResource } from "@clerk/types";
import { ActionTooltip } from "../ActionTooltip";

interface Props {
	test: TestType;
	setTest: React.Dispatch<React.SetStateAction<TestType>>;
	session: ActiveSessionResource | null | undefined;
}

const titleSchema = z
	.string()
	.min(1, { message: "Email cannot be empty" })
	.email("This is not a valid email.");

const CollaborationsDialog = ({ test, setTest, session }: Props) => {
	const { toast } = useToast();
	const [emailInput, setEmailInput] = useState<string>("");

	const handleAdd = async () => {
		if (session?.user.id === test.authorId) {
			try {
				const validatedEmail = titleSchema.parse(emailInput);
				await fetchUserByEmail(validatedEmail).then((res) => {
					if (!res) {
						throw Error("No such user exists");
					}
				});

				if (test.collaboratorEmails?.some((collaborator) => collaborator === emailInput)) {
					toast({
						description: "This email is already added.",
						variant: "destructive",
					});
					return; // Exit the function
				}

				setTest((prevTest) => ({
					...prevTest,
					collaboratorEmails: [...(prevTest.collaboratorEmails ?? []), validatedEmail],
				}));
				setEmailInput("");
				toast({
					description: (
						<p>
							🎉 Added <strong style={{ fontWeight: "bold" }}>{emailInput}</strong> to
							collaborators.
						</p>
					),
				});
			} catch (error: unknown) {
				if (error instanceof z.ZodError) {
					toast({
						description: error.issues[0].message,
						variant: "destructive",
					});
				} else if (error instanceof Error) {
					toast({
						description: error.message,
						variant: "destructive",
					});
				}
			}
		} else {
			toast({
				description: "Only test author can do that.",
				variant: "destructive",
			});
		}
	};

	const handleDelete = (email: String) => {
		if (session?.user.id === test.authorId) {
			setTest((prevTest) => ({
				...prevTest,
				collaboratorEmails: prevTest.collaboratorEmails?.filter((item) => item !== email),
			}));
			toast({
				description: (
					<p>
						👋 Removed <strong style={{ fontWeight: "bold" }}>{email}</strong> from collaborators.
					</p>
				),
			});
		} else {
			toast({
				description: "Only test author can do that.",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog>
			<ActionTooltip label="Collaborators">
				<DialogTrigger asChild>
					<Button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
						<UsersIcon className="w-5 h-5" />
					</Button>
				</DialogTrigger>
			</ActionTooltip>

			<DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-auto">
				<DialogHeader>
					<DialogTitle>Collaborators</DialogTitle>
					<DialogDescription>Add users to contribute to your test.</DialogDescription>
				</DialogHeader>

				<div className="flex gap-3">
					<Input
						placeholder="Collaborator email..."
						type="email"
						onChange={(e) => setEmailInput(e.target.value)}
						value={emailInput}
					/>
					<Button
						className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
						onClick={handleAdd}
					>
						Add
					</Button>
				</div>
				<CollaboratorsTable collaborators={test.collaboratorEmails} onDelete={handleDelete} />
			</DialogContent>
		</Dialog>
	);
};

export default CollaborationsDialog;
