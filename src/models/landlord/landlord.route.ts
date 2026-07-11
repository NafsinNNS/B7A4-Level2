import { Router } from "express";
import { landlordController } from "./landlord.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { activeStatus } from "../../middlewares/activeStatus";

const router = Router();

router.post("/properties", auth(Role.LANDLORD), activeStatus, landlordController.createProperty);
router.put("/properties/:id", auth(Role.LANDLORD), activeStatus, landlordController.updateProperty);
router.delete("/properties/:id", auth(Role.LANDLORD), activeStatus, landlordController.deleteProperty);
router.get("/requests", auth(Role.LANDLORD), activeStatus, landlordController.getAllRequests);
router.patch("/requests/:id", auth(Role.LANDLORD), activeStatus, landlordController.updateRequestStatus);

export const landlordRoutes = router;