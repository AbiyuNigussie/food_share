import express from "express";
import { handleAutoComplete } from "../controllers/geocodeController";

const router = express.Router();

router.get("/autocomplete", handleAutoComplete);

export const GeoMapRoutes = router;
