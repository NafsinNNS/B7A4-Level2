import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentRequestController } from "./rentRequest.controller";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.TENANT, Role.LANDLORD), rentRequestController.createRentRequest);
router.get("/", auth(Role.ADMIN, Role.TENANT, Role.LANDLORD), rentRequestController.getRentRequest);
router.get("/:id", auth(Role.ADMIN, Role.TENANT, Role.LANDLORD), rentRequestController.getRentRequestDetails);

export const rentRequestRoutes = router;