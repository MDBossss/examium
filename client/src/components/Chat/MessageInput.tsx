import { FilePlus2Icon, ImagePlusIcon, PlusCircleIcon, SendIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/Dropdown";

const schema = z.object({
	messageContent: z.string().min(1),
});

const MessageInput = () => {
	const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
		console.log(data);
	};

	return (
		<form
			className="flex w-full max-w-4xl gap-2 p-2 mx-auto mt-auto bg-gray-900 rounded-sm"
			onSubmit={handleSubmit(onSubmit)}
		>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="self-end" type="button">
						<PlusCircleIcon className="w-6 h-6 " />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="left-0 w-56 -bottom-0" side="top" sticky="always">
					<DropdownMenuLabel>Attach files</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<ImagePlusIcon className="w-4 h-4 mr-2" />
							<span>Image</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<FilePlus2Icon className="w-4 h-4 mr-2" />
							<span>Document</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<Textarea className="resize-none" {...register("messageContent")} />

			<Button
				className="self-end bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
				type="submit"
			>
				<SendIcon className="w-6 h-6 " />
			</Button>
		</form>
	);
};

export default MessageInput;
