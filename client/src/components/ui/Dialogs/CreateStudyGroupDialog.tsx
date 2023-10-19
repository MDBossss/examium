import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./Dialog";
import { Button } from "../Button";
import { Label } from "../Label";
import { Input } from "../Input";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../../hooks/useToast";
import { Switch } from "../Switch";
import ImageUpload from "../../ImageUpload";

const schema = z.object({
	name: z.string().max(50, { message: "Name must be at most 50 characters" }),
	description: z.string().max(200, { message: "Description must be at most 200 characters" }),
	imageUrl: z.string(),
	isPublic: z.boolean(),
});

const CreateStudyGroupDialog = () => {
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});
	const { toast } = useToast();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
		//create the group inside the db
	};

	console.log(errors);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button className="w-full m-2 md:w-fit">Create Study Group</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Study Group</DialogTitle>
					<DialogDescription>Learn together with your very own study group!</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid items-center grid-cols-4 gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input id="group-name" placeholder="Insert name..." {...register("name")} className="col-span-3" />
					</div>
					<div className="grid items-center grid-cols-4 gap-4">
						<Label htmlFor="group-description" className="text-right">
							Description
						</Label>
						<Input id="group-description" placeholder="Insert description..." {...register("description")} className="col-span-3" />
					</div>
					<div className="grid items-center grid-cols-4 gap-4">
						<Label htmlFor="group-public" className="text-right">
							Public
						</Label>
						<Switch
							id="group-public"
							className="col-span-1"
                            defaultChecked={true}
							onCheckedChange={(v) => setValue("isPublic", v)}
							{...register("isPublic")}
						/>
					</div>
                    <div className="grid items-center grid-cols-4 gap-4">
						<Label htmlFor="group-image" className="text-right">
							Public
						</Label>
						<ImageUpload/>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateStudyGroupDialog;
