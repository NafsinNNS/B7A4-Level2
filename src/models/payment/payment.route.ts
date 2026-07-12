import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/create/:id", auth(Role.ADMIN, Role.TENANT, Role.LANDLORD), paymentController.createPayment);
router.post("/confirm", paymentController.handleWebhook);
router.get("/", auth(Role.TENANT), paymentController.getPaymentsByUserId);
router.get("/:id", auth(Role.TENANT, Role.ADMIN), paymentController.getPaymentDetails);

export const paymentRoutes = router;