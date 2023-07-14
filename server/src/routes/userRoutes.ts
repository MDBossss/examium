import express, { Router } from "express";
import UserController from "../controllers/UserController";

const router: Router = express.Router();
const userController = new UserController();

router.use(express.json())

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/email/:email",userController.getUserByEmail)
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
