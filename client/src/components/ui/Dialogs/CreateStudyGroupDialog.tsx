import { useEffect, useState } from "react";
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
	name: z
		.string()
		.max(50, { message: "Name must be at most 50 characters" })
		.min(2, { message: "Name must have at least 2 characters" }),
	description: z
		.string()
		.max(200, { message: "Description must be at most 200 characters" })
		.min(10, { message: "Description must have at least 10 characters" }),
	imageUrl: z.string().min(1, { message: "Cover image is required" }).default(""),
	isPublic: z.boolean().optional(),
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
		console.log(data);
	};

	const handleSetImage = (imageUrl: string | undefined) => {
		if (imageUrl) {
			setValue("imageUrl", imageUrl);
		} else {
			setValue("imageUrl", "");
		}
	};

	useEffect(() => {
		Object.keys(errors).forEach((field) => {
			const error = errors[field as keyof typeof errors];
			toast({
				description: error?.message?.toString(),
				variant: "destructive",
			});
		});
	}, [errors]);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button className="w-full m-2 md:w-fit">Create Study Group</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Create Study Group</DialogTitle>
						<DialogDescription>Learn together with your very own study group!</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid items-center grid-cols-4 gap-4">
							<Label htmlFor="group-name" className="text-right">
								Name
							</Label>
							<Input
								id="group-name"
								placeholder="Insert name..."
								{...register("name")}
								className="col-span-3"
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label htmlFor="group-description" className="text-right">
								Description
							</Label>
							<Input
								id="group-description"
								placeholder="Insert description..."
								{...register("description")}
								className="col-span-3"
							/>
						</div>
						<div className="grid items-center grid-cols-4 gap-4">
							<Label htmlFor="group-public" className="text-right">
								Public
							</Label>
							<Switch
								id="group-public"
								className="col-span-1"
								onCheckedChange={(v) => setValue("isPublic", v)}
								// {...register("isPublic")}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="group-image" className="">
								Cover Image
							</Label>
							<ImageUpload onSetImage={handleSetImage} />
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Create group</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateStudyGroupDialog;
