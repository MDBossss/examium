import { ReactNode, useEffect, useState } from "react";
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
import { createStudyGroup, updateStudyGroup } from "../../../api/groups";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "@clerk/clerk-react";
import { StudyGroupType } from "../../../../../shared/models";

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
	isPublic: z.boolean().default(true),
});

interface Props {
	defaultStudyGroup?: StudyGroupType;
	onCreated?: (studyGroup?: StudyGroupType) => void;
	children: ReactNode;
}

const CreateStudyGroupDialog = ({ defaultStudyGroup, onCreated, children }: Props) => {
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const { session } = useSession();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: defaultStudyGroup,
	});
	const { toast } = useToast();

	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
		if (defaultStudyGroup) {
			//update the group instead of creating a new one
			const tempStudyGroup = {
				...defaultStudyGroup,
				name: data.name,
				description: data.description,
				isPublic: data.isPublic,
				imageUrl: data.imageUrl,
			};

			await updateStudyGroup(tempStudyGroup)
				.then(() => {
					onCreated ? onCreated(tempStudyGroup) : null;
					setDialogOpen(false);
					toast({
						title: "✅ Group updated successfully",
					});
				})
				.catch((err) => {
					console.log(err);
					toast({
						title: "😓 Failed to update group",
						variant: "destructive",
					});
				});
		} else {
			await createStudyGroup({
				id: uuidv4(),
				name: data.name,
				description: data.description,
				isPublic: data.isPublic,
				imageUrl: data.imageUrl,
				ownerId: session?.user.id!,
			})
				.then(() => {
					onCreated ? onCreated() : null;
					setDialogOpen(false);
					toast({
						title: "✅ Group created successfully",
					});
				})
				.catch((err) => {
					console.log(err);
					toast({
						title: "😓 Failed to create group",
						variant: "destructive",
					});
				});
		}
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

	console.log(defaultStudyGroup?.isPublic)

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>
							{defaultStudyGroup ? "Edit Study Group" : "Study Study Group"}
						</DialogTitle>
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
								defaultChecked={defaultStudyGroup ? defaultStudyGroup?.isPublic : true}
								onCheckedChange={(v) => setValue("isPublic", v)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="group-image" className="">
								Cover Image
							</Label>
							<ImageUpload
								imageUrl={defaultStudyGroup ? defaultStudyGroup.imageUrl : undefined}
								onSetImage={handleSetImage}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">{defaultStudyGroup ? "Edit group" : "Create group"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateStudyGroupDialog;
