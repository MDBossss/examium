import express, { Router } from "express";
import EventController from "../controllers/EventController";

const router: Router = express.Router();
const eventController = new EventController();

router.use(express.json());

router.get("/:userId", eventController.getUserEvents);
router.get("/:userId/today", eventController.getTodayUserEventsWithTests);
router.post("/:userId", eventController.createEvent);
router.put("/:userId", eventController.updateEvent);
router.delete("/:event_id", eventController.deleteEvent);

export default router;
