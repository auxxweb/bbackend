import  express  from "express";
import authMiddleWare from "../Middleware/authMiddleware.js";
import { blockUser, deleteUser, getAllUser, getUser, loginUser, otpValidation, otpVerification, registerUser, UnblockUser, updateUser } from "../Controllers/BusinessOwner.js";
const router=express.Router();
router.post("/register",registerUser )
router.post("/login",loginUser)
router.post("/mobile", otpValidation);
router.post("/otp", otpVerification);
router.get("/",getAllUser) 
router.get("/:id",getUser)
router.put("/:id",authMiddleWare, updateUser)
router.delete("/:id",authMiddleWare,deleteUser)

router.put("/:id/block" ,blockUser)
router.put("/:id/unblock" ,UnblockUser)
router.get("/search/:key",getAllUser)
export default router;