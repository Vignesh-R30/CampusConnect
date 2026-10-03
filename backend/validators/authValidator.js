const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['student', 'admin', 'faculty', 'alumni']).optional(),
    adminKey: z.string().optional(),
    college: z.string().optional(),
    department: z.string().optional(),
    year: z.string().optional(),
    profilePicture: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['student', 'admin', 'faculty', 'alumni']).optional(),
    adminKey: z.string().optional()
});

module.exports = {
    registerSchema,
    loginSchema
};
