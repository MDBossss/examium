import express, { Router } from "express";
import TestController from "../controllers/TestController";

const router: Router = express.Router();
const testController = new TestController();

router.use(express.json());

router.get("/", testController.getAllTests);
router.get("/collaborations/:id", testController.getCollaborationTestsByUserId);
router.get("/user/:id", testController.getTestsByUserId);
router.get("/:id", testController.getTestById);
router.post("/", testController.createTest);
router.put("/:id", testController.updateTest);
router.delete("/:id", testController.deleteTest);

export default router;
