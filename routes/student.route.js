import express from "express";
import {
    studentApplicationForm,
    getStudentApplications,
    getStudentApplicationById,
    deleteStudentApplication
} from "../controllers/student.controller.js";
import { upload } from "../lib/multer.lib.js";
import { isLoggedIn, hasAccess } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/application", upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "academicCertificate", maxCount: 1 },
    { name: "englishCertificate", maxCount: 1 },
    { name: "osid", maxCount: 1 },
    { name: "other", maxCount: 1 },
    { name: "formData", maxCount: 1 },
]), studentApplicationForm);

router.get('/students', isLoggedIn, hasAccess('readAccess'), getStudentApplications);
router.get('/students/:id', isLoggedIn, hasAccess('readAccess'), getStudentApplicationById);
router.delete('/students/:id', isLoggedIn, hasAccess('fullAccess'), deleteStudentApplication);

export default router;
