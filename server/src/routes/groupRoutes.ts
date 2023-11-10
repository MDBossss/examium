import express, { Router } from "express";
import GroupController from "../controllers/GroupController";

const router: Router = express.Router();
const groupController = new GroupController();

router.use(express.json());

router.get("/public", groupController.getPublicStudyGroups);
router.get("/:id", groupController.getStudyGroupById);
router.get("/user/:userId", groupController.getUserStudyGroups);
router.post("/", groupController.createStudyGroup);
router.post("/join/:studyGroupId", groupController.joinStudyGroup);
router.patch("/leave/:studyGroupId",groupController.leaveStudyGroup)
router.put("/:id", groupController.updateStudyGroup);
router.delete("/:id", groupController.deleteStudyGroup);

export default router;
