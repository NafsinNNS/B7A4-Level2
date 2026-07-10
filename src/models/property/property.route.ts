import { Router } from "express";
import { propertyController } from "./property.controller";

const router = Router();

router.get("/",propertyController.getAllProperties);
router.get("/:id",propertyController.getPropertyDetails);

export const propertyRoutes = router;