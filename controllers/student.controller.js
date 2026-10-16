import prisma from '../lib/prisma.lib.js';
import EmailHelper from "../helpers/emailHelper.js";
import { studentApplicationTemplate } from '../templates/student.templates.js';

export const studentApplicationForm = async (req, res) => {
    console.log('Received student application form submission');
    try {
        const {
            // Document checklist
            hasPassport,
            hasCopiesOfAcademicOfHome,
            hasCopiesOfAcademicOfAustralia,
            hasCurrentCOE,
            hasQTEassessmentForm,
            hasCurriculumVitae,
            references,
            currentLocation,
            applicationType,

            // Personal Information
            title,
            givenName,
            middleName,
            familyName,
            dateOfBirth,
            emailAddress,
            mobile,
            homePhone,

            // Address
            streetNumber,
            streetName,
            city,
            stateProvince,
            postalCode,
            country,

            // Citizenship & Visa
            countryOfCitizenship,
            passportNumber,
            visaNumber,

            // English Proficiency
            ielts,
            dateOfTest,

            // Additional Personal Info
            gender,
            countryOfBirth,
            cityOfBirth,
            austCitizenshipStatus,
            aboriginalOrTorresStraitIslander,
            employmentStatus,
            doSpeakEnglishAtHome,
            requireEnglishAssisance,
            higheshtSchoolEducation,
            yearCompleted,
            disabilities,
            priorEducation,

            // Contact & Emergency
            alternateEmailAddress,
            usi,
            emergencyContactName,
            emergencyRelationship,
            emergencyPhonNumber,
            emergencyContactComments,

            // Course Information
            qualificationLocation,
            intakeDate,
            isApplyingForCreditTransfer,
            isApplyingForRecognitionOfRPL,
            courses,

            // OSHC Information
            oshcType,
            oshcProviderName,
            oschMembershipNumber,
            oschExpiryDate,

            // Language & Literacy Assessment
            iCan,
            isMyFirstLang,
            canReadTimeOnClock,
            isMyFirstlang2,
            canAddUpThings,
            isMyFirstLang3,
            canKnowHowMuchChange,
            isMyFirstLang4,
            canUsePhone,
            isMyFirstLang5,
            canTakePhoneMessage,
            isMyFirstLang6,
            canFillAFormForTimesheet,
            isMyFirstLang7,
            canFollowInstructions,
            isMyFirstLang8,

            // Previous Attendance & Agreements
            haveAttendedAUSCBefore,
            agreeToBeContacted,
            agreeTermsAndConditions,

            // Signature
            fullName,
            signature,

            // Agent Information
            agentName,
            agentEmail,
            businessName,
            studentType,
        } = req.body;

        // Access uploaded files
        const passport = req.files?.passport?.[0];
        const academicCertificate = req.files?.academicCertificate?.[0];
        const englishCertificate = req.files?.englishCertificate?.[0];
        const osid = req.files?.osid?.[0];
        const other = req.files?.other?.[0];
        const formData = req.files?.formData?.[0];

        // 1. Prepare Database Save Promise
        const dbPromise = prisma.studentApplication.create({
            data: {
                hasPassport: hasPassport === 'true' || hasPassport === true,
                hasCopiesOfAcademicOfHome: hasCopiesOfAcademicOfHome === 'true' || hasCopiesOfAcademicOfHome === true,
                hasCopiesOfAcademicOfAustralia: hasCopiesOfAcademicOfAustralia === 'true' || hasCopiesOfAcademicOfAustralia === true,
                hasCurrentCOE: hasCurrentCOE === 'true' || hasCurrentCOE === true,
                hasQTEassessmentForm: hasQTEassessmentForm === 'true' || hasQTEassessmentForm === true,
                hasCurriculumVitae: hasCurriculumVitae === 'true' || hasCurriculumVitae === true,
                references,
                currentLocation,
                applicationType,
                title,
                givenName,
                middleName,
                familyName,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                emailAddress,
                mobile,
                homePhone,
                streetNumber,
                streetName,
                city,
                stateProvince,
                postalCode,
                country,
                countryOfCitizenship,
                passportNumber,
                visaNumber,
                ielts,
                dateOfTest: dateOfTest ? new Date(dateOfTest) : null,
                gender,
                countryOfBirth,
                cityOfBirth,
                austCitizenshipStatus,
                aboriginalOrTorresStraitIslander,
                employmentStatus,
                doSpeakEnglishAtHome: doSpeakEnglishAtHome === 'true' || doSpeakEnglishAtHome === true,
                requireEnglishAssisance: requireEnglishAssisance === 'true' || requireEnglishAssisance === true,
                higheshtSchoolEducation,
                yearCompleted,
                disabilities,
                priorEducation,
                alternateEmailAddress,
                usi,
                emergencyContactName,
                emergencyRelationship,
                emergencyPhonNumber,
                emergencyContactComments,
                qualificationLocation,
                intakeDate: intakeDate ? new Date(intakeDate) : null,
                isApplyingForCreditTransfer: isApplyingForCreditTransfer === 'true' || isApplyingForCreditTransfer === true,
                isApplyingForRecognitionOfRPL: isApplyingForRecognitionOfRPL === 'true' || isApplyingForRecognitionOfRPL === true,
                courses: courses || [],
                oshcType,
                oshcProviderName,
                oschMembershipNumber,
                oschExpiryDate: oschExpiryDate ? new Date(oschExpiryDate) : null,
                iCan: iCan === 'true' || iCan === true,
                isMyFirstLang: isMyFirstLang === 'true' || isMyFirstLang === true,
                canReadTimeOnClock: canReadTimeOnClock === 'true' || canReadTimeOnClock === true,
                isMyFirstlang2: isMyFirstlang2 === 'true' || isMyFirstlang2 === true,
                canAddUpThings: canAddUpThings === 'true' || canAddUpThings === true,
                isMyFirstLang3: isMyFirstLang3 === 'true' || isMyFirstLang3 === true,
                canKnowHowMuchChange: canKnowHowMuchChange === 'true' || canKnowHowMuchChange === true,
                isMyFirstLang4: isMyFirstLang4 === 'true' || isMyFirstLang4 === true,
                canUsePhone: canUsePhone === 'true' || canUsePhone === true,
                isMyFirstLang5: isMyFirstLang5 === 'true' || isMyFirstLang5 === true,
                canTakePhoneMessage: canTakePhoneMessage === 'true' || canTakePhoneMessage === true,
                isMyFirstLang6: isMyFirstLang6 === 'true' || isMyFirstLang6 === true,
                canFillAFormForTimesheet: canFillAFormForTimesheet === 'true' || canFillAFormForTimesheet === true,
                isMyFirstLang7: isMyFirstLang7 === 'true' || isMyFirstLang7 === true,
                canFollowInstructions: canFollowInstructions === 'true' || canFollowInstructions === true,
                isMyFirstLang8: isMyFirstLang8 === 'true' || isMyFirstLang8 === true,
                haveAttendedAUSCBefore: haveAttendedAUSCBefore === 'true' || haveAttendedAUSCBefore === true,
                agreeToBeContacted: agreeToBeContacted === 'true' || agreeToBeContacted === true,
                agreeTermsAndConditions: agreeTermsAndConditions === 'true' || agreeTermsAndConditions === true,
                fullName,
                signature,
                agentName,
                agentEmail,
                businessName,
                studentType,
            }
        }).catch(err => {
            console.error('Database save failed:', err);
            return null; // Return null so Promise.allSettled doesn't reject completely
        });

        // 2. Prepare Email Sending Promise
        const emailPromise = (async () => {
            const html = EmailHelper.renderTemplate(studentApplicationTemplate, {});
            const attachments = [];

            if (passport) attachments.push({ filename: passport.originalname, content: passport.buffer });
            if (academicCertificate) attachments.push({ filename: academicCertificate.originalname, content: academicCertificate.buffer });
            if (englishCertificate) attachments.push({ filename: englishCertificate.originalname, content: englishCertificate.buffer });
            if (osid) attachments.push({ filename: osid.originalname, content: osid.buffer });
            if (other) attachments.push({ filename: other.originalname, content: other.buffer });
            if (formData) attachments.push({ filename: formData.originalname, content: formData.buffer });

            const emailHelper = new EmailHelper();
            await emailHelper.sendEmail({
                to: process.env.NODEMAILER_EMAIL_RECIEVER_2,
                subject: `New Student Application`,
                text: `New student application received`,
                html: html,
                attachments
            });
        })().catch(err => {
            console.error('Email sending failed:', err);
            return null;
        });

        // Run both actions concurrently and independently
        const results = await Promise.allSettled([dbPromise, emailPromise]);

        const dbResult = results[0];
        const emailResult = results[1];

        // Check if critical core functionality completely tanked both
        if (dbResult.status === 'rejected' && emailResult.status === 'rejected') {
            throw new Error('Both database saving and email notification failed.');
        }

        return res.status(200).json({
            success: true,
            message: "Application submitted successfully",
            details: {
                savedToDatabase: dbResult.status === 'fulfilled' && dbResult.value !== null,
                emailSent: emailResult.status === 'fulfilled'
            }
        });

    } catch (error) {
        console.log('Error from student application controller:', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred while processing your application'
        });
    }
};

export const getStudentApplications = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '' } = req.query;

        // Convert query parameters to integers
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        if (page < 1) page = 1;
        if (limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        // Search filter across core fields
        const whereClause = search ? {
            OR: [
                { givenName: { contains: search, mode: 'insensitive' } },
                { familyName: { contains: search, mode: 'insensitive' } },
                { emailAddress: { contains: search, mode: 'insensitive' } },
                { mobile: { contains: search, mode: 'insensitive' } },
                { passportNumber: { contains: search, mode: 'insensitive' } },
                { countryOfCitizenship: { contains: search, mode: 'insensitive' } },
                { currentLocation: { contains: search, mode: 'insensitive' } },
                { businessName: { contains: search, mode: 'insensitive' } },
                { agentName: { contains: search, mode: 'insensitive' } },
                { applicationType: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        // Fetch paginated records and total count concurrently
        const [students, totalCount] = await Promise.all([
            prisma.studentApplication.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.studentApplication.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            success: true,
            message: 'Student applications fetched successfully',
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            data: students
        });

    } catch (error) {
        console.error('Error in getStudentApplications controller:', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred while fetching student applications'
        });
    }
};

export const getStudentApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await prisma.studentApplication.findUnique({
            where: { id }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student application not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error in getStudentApplicationById:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch student application'
        });
    }
};

export const deleteStudentApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma.studentApplication.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Student application not found'
            });
        }

        await prisma.studentApplication.delete({ where: { id } });

        return res.status(200).json({
            success: true,
            message: 'Student application deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteStudentApplication:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete student application'
        });
    }
};