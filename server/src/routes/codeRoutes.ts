import express ,{Router} from "express";
import CodeController from "../controllers/CodeController";

const router: Router = express.Router();
const codeController = new CodeController();

router.use(express.json());

router.get("/",codeController.compare);

export default router;