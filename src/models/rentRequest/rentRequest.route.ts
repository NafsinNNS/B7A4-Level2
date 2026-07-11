import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentRequestController } from "./rentRequest.controller";
import { activeStatus } from "../../middlewares/activeStatus";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.TENANT, Role.LANDLORD), activeStatus, rentRequestController.createRentRequest);
router.get("/", auth(Role.ADMIN, Role.TENANT, Role.LANDLORD), activeStatus, rentRequestController.getRentRequest);
router.get("/:id", auth(Role.ADMIN, Role.TENANT, Role.LANDLORD), activeStatus, rentRequestController.getRentRequestDetails);

export const rentRequestRoutes = router;