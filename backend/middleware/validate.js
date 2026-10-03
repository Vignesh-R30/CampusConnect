const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            const errorMessages = err.errors.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json({ message: errorMessages.join(', '), errors: errorMessages });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = validate;
