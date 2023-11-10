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
import ImageUpload from "../../FileUpload";
import { createStudyGroup, deleteStudyGroup, updateStudyGroup } from "../../../api/groups";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "@clerk/clerk-react";
import { StudyGroupType } from "../../../../../shared/models";
import DeleteGroupDialog from "./DeleteGroupDialog";
import { useNavigate } from "react-router-dom";
import { removeFileFromBucket } from "../../../utils/supabaseUtils";
import FileUpload from "../../FileUpload";

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
	const navigate = useNavigate();
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
						title: "😓 Failed to delete group",
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

	const handleDeleteGroup = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if (defaultStudyGroup) {
			setDialogOpen(false);
			await removeFileFromBucket(
				import.meta.env.VITE_SUPABASE_BUCKET_NAME,
				defaultStudyGroup.imageUrl
			);
			await deleteStudyGroup(defaultStudyGroup?.id)
				.then(() => {
					navigate("/groups");
					toast({
						description: "✅ Group deleted successfully.",
					});
					// weird bug fix when navigating to the groups the body has pointer-events:none
					document.body.style.pointerEvents = "auto";
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
							<FileUpload
								defaultFilePath={defaultStudyGroup ? defaultStudyGroup.imageUrl : undefined}
								onSetFilePath={handleSetImage}
								fileType="image"
							/>
						</div>
					</div>
					<DialogFooter className="flex flex-col-reverse gap-2">
						{defaultStudyGroup ? <DeleteGroupDialog onTrigger={handleDeleteGroup} /> : null}
						<Button type="submit">{defaultStudyGroup ? "Edit group" : "Create group"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateStudyGroupDialog;
