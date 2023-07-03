import express, { Router } from "express";
import TestController from "../controllers/TestController";

const router: Router = express.Router();
const testController = new TestController();

router.get("/", testController.getAllTests);
router.get("/:id", testController.getTestById);
router.post("/", testController.createTest);
router.put("/:id", testController.updateUser);
router.delete("/:id", testController.deleteTest);

export default router;
