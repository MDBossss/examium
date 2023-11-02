import express, { Router } from "express";
import MessageController from "../controllers/MessageController";

const router: Router = express.Router();
const messageController = new MessageController();

router.use(express.json());

router.post("/", messageController.createMessage);
router.get("/", messageController.fetchMessages);
router.delete("/:id",messageController.deleteMessage);

export default router;
