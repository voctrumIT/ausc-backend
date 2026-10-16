import EmailHelper from "../helpers/emailHelper.js";
import { contactUsTemplate, agentApplicationTemplate } from "../templates/contactus.templates.js";
import prisma from "../lib/prisma.lib.js";

export const contactUs = async (req, res) => {
    console.log('Received contact us submission');
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        // 1. Prepare Database Save Promise
        const dbPromise = prisma.contactMessage.create({
            data: {
                name,
                email,
                phone,
                message,
            }
        }).catch(err => {
            console.error('Database save failed:', err);
            return null; // Return null so Promise.allSettled doesn't reject completely
        });

        // 2. Prepare Email Sending Promise
        const emailPromise = (async () => {
            const html = EmailHelper.renderTemplate(contactUsTemplate, {
                name: name,
                email: email,
                phone: phone,
                message: message,
            });

            const emailHelper = new EmailHelper();
            await emailHelper.sendEmail({
                to: process.env.NODEMAILER_EMAIL_RECIEVER,
                subject: 'New contact message received',
                text: "You have received a new contact message from " + name,
                html: html
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
            message: 'Contact message received successfully',
            details: {
                savedToDatabase: dbResult.status === 'fulfilled' && dbResult.value !== null,
                emailSent: emailResult.status === 'fulfilled'
            }
        });

    } catch (error) {
        console.log('error from the contact us controller: ', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred while processing your request'
        });
    }
};

export const agentRegistrationForm = async (req, res) => {
    console.log('Received agent registration form submission');
    try {
        const {
            businessType,
            legalName,
            tradingName,
            ownerName,
            placeOfRegistration,
            dateOfRegistration,
            businessNumber,
            maraNo,
            qeacNo,
            representingCountries,
            ceoName,
            email,
            mobile,
            landline,
            contactPerson,
            contactPersonEmail,
            contactPersonMobile,
            contactPersonLandline,
            headOfficeAddress,
            website,
            numberOfBranches,
            locationOfBranches,
            coursesInterrestedIn,
            nameOfIndustrialBody,
            yearOfMembership,
            institutionName,
            yearOfAffiliation,
            numberOfStudents,
            firstYearIntakes,
            sudentSupportType,
            feesChargeDescription,
            additionalInformationMarketing,
            standardFourCompliance,
            pierAccreditation,
            EsosAct,
            studentOnBoardingPurpose,
            auscMarketingCompliance,
            auscMarketingMaterial,
            refereeOne,
            refereeContactNumber,
            organization,
            position,
            refereeEmailAddress,
            refereeTwo,
            refereeTwoContactNumber,
            refereeTwoOrganization,
            refereeTwoPosition,
            refereeTwoEmailAddress,
            authorizedPersonName,
            authorizedPersonPosition,
            signature,
        } = req.body;

        // Access uploaded files
        const businessProfileFile = req.files?.businessProfileFile?.[0];
        const registrationCertificate = req.files?.registrationCertificate?.[0];
        const maraQeacCertificate = req.files?.maraQeacCertificate?.[0];
        const formData = req.files?.formData?.[0];

        // 1. Prepare Database Save Promise
        const dbPromise = prisma.agentRegistration.create({
            data: {
                businessType,
                legalName,
                tradingName,
                ownerName,
                placeOfRegistration,
                dateOfRegistration: dateOfRegistration ? new Date(dateOfRegistration) : null,
                businessNumber,
                maraNo,
                qeacNo,
                representingCountries,
                ceoName,
                email,
                mobile,
                landline,
                contactPerson,
                contactPersonEmail,
                contactPersonMobile,
                contactPersonLandline,
                headOfficeAddress,
                website,
                numberOfBranches,
                locationOfBranches,
                coursesInterrestedIn,
                nameOfIndustrialBody,
                yearOfMembership,
                institutionName,
                yearOfAffiliation,
                numberOfStudents,
                firstYearIntakes,
                sudentSupportType,
                feesChargeDescription,
                additionalInformationMarketing,
                standardFourCompliance: standardFourCompliance === 'true' || standardFourCompliance === true,
                pierAccreditation: pierAccreditation === 'true' || pierAccreditation === true,
                EsosAct: EsosAct === 'true' || EsosAct === true,
                studentOnBoardingPurpose: studentOnBoardingPurpose === 'true' || studentOnBoardingPurpose === true,
                auscMarketingCompliance: auscMarketingCompliance === 'true' || auscMarketingCompliance === true,
                auscMarketingMaterial: auscMarketingMaterial === 'true' || auscMarketingMaterial === true,
                refereeOne,
                refereeContactNumber,
                organization,
                position,
                refereeEmailAddress,
                refereeTwo,
                refereeTwoContactNumber,
                refereeTwoOrganization,
                refereeTwoPosition,
                refereeTwoEmailAddress,
                authorizedPersonName,
                authorizedPersonPosition,
                signature,
            }
        }).catch(err => {
            console.error('Database save failed:', err);
            return null; // Return null so Promise.allSettled doesn't reject completely
        });

        // 2. Prepare Email Sending Promise
        const emailPromise = (async () => {
            const html = EmailHelper.renderTemplate(agentApplicationTemplate, {});
            const attachments = [];

            if (businessProfileFile) {
                attachments.push({
                    filename: businessProfileFile.originalname,
                    content: businessProfileFile.buffer,
                });
            }

            if (registrationCertificate) {
                attachments.push({
                    filename: registrationCertificate.originalname,
                    content: registrationCertificate.buffer,
                });
            }

            if (maraQeacCertificate) {
                attachments.push({
                    filename: maraQeacCertificate.originalname,
                    content: maraQeacCertificate.buffer,
                });
            }

            if (formData) {
                attachments.push({
                    filename: formData.originalname,
                    content: formData.buffer,
                });
            }

            const emailHelper = new EmailHelper();
            await emailHelper.sendEmail({
                to: process.env.NODEMAILER_EMAIL_RECIEVER_2,
                subject: "New AUSC Education Agent Application Received",
                text: `New agent application received from ${legalName}`,
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
        console.log('error from the agent registration form controller: ', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred while processing your request'
        });
    }
};

export const getContactMessages = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '' } = req.query;

        // Convert query parameters to integers
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        // Ensure valid page and limit numbers
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        const whereClause = search
            ? {
                  OR: [
                      { name: { contains: search, mode: 'insensitive' } },
                      { email: { contains: search, mode: 'insensitive' } },
                      { phone: { contains: search, mode: 'insensitive' } },
                      { message: { contains: search, mode: 'insensitive' } },
                  ],
              }
            : {};

        // Fetch paginated records and total count concurrently
        const [messages, totalCount] = await Promise.all([
            prisma.contactMessage.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.contactMessage.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            success: true,
            message: 'Contact messages fetched successfully',
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            data: messages
        });

    } catch (error) {
        console.error('Error in getContactMessages controller:', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred while fetching contact messages'
        });
    }
};

export const getContactMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await prisma.contactMessage.findUnique({
            where: { id }
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Contact enquiry not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Error in getContactMessageById:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch contact enquiry'
        });
    }
};

export const deleteContactMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma.contactMessage.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Contact enquiry not found'
            });
        }

        await prisma.contactMessage.delete({ where: { id } });

        return res.status(200).json({
            success: true,
            message: 'Contact enquiry deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteContactMessage:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete contact enquiry'
        });
    }
};

export const getAgentRegistrations = async (req, res) => {
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
                { legalName: { contains: search, mode: 'insensitive' } },
                { tradingName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { mobile: { contains: search, mode: 'insensitive' } },
                { contactPerson: { contains: search, mode: 'insensitive' } },
                { ceoName: { contains: search, mode: 'insensitive' } },
                { headOfficeAddress: { contains: search, mode: 'insensitive' } },
                { maraNo: { contains: search, mode: 'insensitive' } },
                { qeacNo: { contains: search, mode: 'insensitive' } },
                { representingCountries: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        // Fetch paginated records and total count concurrently
        const [agents, totalCount] = await Promise.all([
            prisma.agentRegistration.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.agentRegistration.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            success: true,
            message: 'Agent registrations fetched successfully',
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            data: agents
        });

    } catch (error) {
        console.error('Error in getAgentRegistrations controller:', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred while fetching agent registrations'
        });
    }
};

export const getAgentRegistrationById = async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await prisma.agentRegistration.findUnique({
            where: { id }
        });

        if (!agent) {
            return res.status(404).json({
                success: false,
                error: 'Agent registration not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: agent
        });
    } catch (error) {
        console.error('Error in getAgentRegistrationById:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch agent registration'
        });
    }
};

export const deleteAgentRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma.agentRegistration.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Agent registration not found'
            });
        }

        await prisma.agentRegistration.delete({ where: { id } });

        return res.status(200).json({
            success: true,
            message: 'Agent registration deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteAgentRegistration:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete agent registration'
        });
    }
};