import express, { Router } from "express";
import UserController from "../controllers/UserController";

const router: Router = express.Router();
const userController = new UserController();

router.use(express.json());

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/email/:email", userController.getUserByEmail);
router.get("/bookmarked/:id", userController.getBookmarkedTestsByUserId);
router.post("/", userController.createUser);
router.put("/bookmarked/:id",userController.addBookmarkedTest);
router.put("/:id", userController.updateUser);
router.put("/location/:id", userController.updateUserLocation);
router.delete("/:id", userController.deleteUser);
router.delete("/bookmarked/:id", userController.removeBookmarkedTest)

export default router;
