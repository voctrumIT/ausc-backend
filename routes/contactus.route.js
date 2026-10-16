import express from "express";
import {
    agentRegistrationForm,
    contactUs,
    getContactMessages,
    getContactMessageById,
    deleteContactMessage,
    getAgentRegistrations,
    getAgentRegistrationById,
    deleteAgentRegistration
} from "../controllers/contactus.controller.js";
import { upload } from "../lib/multer.lib.js";
import { isLoggedIn, hasAccess } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", contactUs);
router.post("/agent-registration", upload.fields([
    { name: "businessProfileFile", maxCount: 1 },
    { name: "registrationCertificate", maxCount: 1 },
    { name: "maraQeacCertificate", maxCount: 1 },
    { name: "formData", maxCount: 1 },
]), agentRegistrationForm);

// Contact enquiries routes
router.get('/contacts', isLoggedIn, hasAccess('readAccess'), getContactMessages);
router.get('/contacts/:id', isLoggedIn, hasAccess('readAccess'), getContactMessageById);
router.delete('/contacts/:id', isLoggedIn, hasAccess('fullAccess'), deleteContactMessage);

// Agent registration routes
router.get('/agents', isLoggedIn, hasAccess('readAccess'), getAgentRegistrations);
router.get('/agents/:id', isLoggedIn, hasAccess('readAccess'), getAgentRegistrationById);
router.delete('/agents/:id', isLoggedIn, hasAccess('fullAccess'), deleteAgentRegistration);

export default router;