import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

// Helmet - Security headers (CSP, X-Frame-Options, etc.)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://*.supabase.co"],
            mediaSrc: ["'self'", "blob:"],
        },
    },
    crossOriginEmbedderPolicy: false, // Required for some external resources
}));

// CORS - Strict origin control
const allowedOrigins = NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'https://orign8.com']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting - Prevent abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const transcriptionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit transcription requests (more expensive)
    message: { error: 'Too many transcription requests, please wait a moment.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Body parsing - Route-specific limits
// Large limit for AI endpoints handling audio (10MB)
const jsonParserLarge = express.json({ limit: '10mb' });
// URL-encoded form data (1MB limit for standard forms)
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// Note: JSON parsing is applied per-route to enforce different size limits
// - /api/generate-content and /api/transcribe use jsonParserLarge (10MB)
// - Future lightweight endpoints should use express.json({ limit: '1mb' })

// =============================================================================
// REQUEST VALIDATION SCHEMAS (Zod)
// =============================================================================

const ContentPartSchema = z.object({
    text: z.string().max(10000).optional(),
    inlineData: z.object({
        mimeType: z.enum(['audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg']),
        data: z.string().max(10 * 1024 * 1024), // ~10MB base64 max (aligns with body limit)
    }).optional(),
}).refine(data => data.text || data.inlineData, {
    message: 'Content part must have either text or inlineData',
});

const GenerateContentSchema = z.object({
    model: z.string().regex(/^gemini-[\w.-]+$/).default('gemini-2.0-flash'),
    contents: z.union([
        z.object({
            parts: z.array(ContentPartSchema).min(1).max(10),
        }),
        z.array(z.object({
            parts: z.array(ContentPartSchema).min(1).max(10),
        })),
    ]),
    config: z.object({
        temperature: z.number().min(0).max(2).optional(),
        maxOutputTokens: z.number().min(1).max(8192).optional(),
        topP: z.number().min(0).max(1).optional(),
        topK: z.number().min(1).max(100).optional(),
    }).optional(),
});

// =============================================================================
// GEMINI CLIENT INITIALIZATION
// =============================================================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.error('CRITICAL: GEMINI_API_KEY is not configured properly.');
    console.error('Please set a valid API key in .env.local');
}

const ai = apiKey && apiKey !== 'PLACEHOLDER_API_KEY'
    ? new GoogleGenAI({ apiKey })
    : null;

// =============================================================================
// HEALTH CHECK ENDPOINT
// =============================================================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        geminiConfigured: !!ai,
    });
});

// =============================================================================
// API ROUTES
// =============================================================================

app.post('/api/generate-content', jsonParserLarge, apiLimiter, async (req, res) => {
    try {
        // Validate API key is configured
        if (!ai) {
            console.error('Generate content called but Gemini API not configured');
            return res.status(503).json({
                error: 'AI service temporarily unavailable',
                code: 'SERVICE_UNAVAILABLE'
            });
        }

        // Validate request body with Zod
        const validationResult = GenerateContentSchema.safeParse(req.body);

        if (!validationResult.success) {
            console.warn('Invalid request body:', validationResult.error.errors);
            return res.status(400).json({
                error: 'Invalid request format',
                code: 'VALIDATION_ERROR',
                details: validationResult.error.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            });
        }

        const { model, contents, config } = validationResult.data;

        // Call Gemini API
        const response = await ai.models.generateContent({
            model,
            contents,
            config,
        });

        res.json(response);
    } catch (error) {
        console.error('Error generating content:', error);

        // Don't expose internal error details to client
        const statusCode = error.status || 500;
        const isClientError = statusCode >= 400 && statusCode < 500;

        res.status(statusCode).json({
            error: isClientError ? error.message : 'Failed to generate content',
            code: error.code || 'GENERATION_ERROR',
        });
    }
});

// Dedicated transcription endpoint with stricter rate limiting
app.post('/api/transcribe', jsonParserLarge, transcriptionLimiter, async (req, res) => {
    try {
        if (!ai) {
            return res.status(503).json({
                error: 'Transcription service temporarily unavailable',
                code: 'SERVICE_UNAVAILABLE'
            });
        }

        // Validate audio data
        const TranscribeSchema = z.object({
            audio: z.object({
                mimeType: z.enum(['audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg']),
                data: z.string().min(100).max(10 * 1024 * 1024), // At least some data, max ~10MB base64
            }),
        });

        const validationResult = TranscribeSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Invalid audio data',
                code: 'VALIDATION_ERROR',
            });
        }

        const { audio } = validationResult.data;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: audio.mimeType,
                            data: audio.data,
                        },
                    },
                    {
                        text: 'Transcribe this audio exactly as spoken. Output only the transcription, no additional commentary.'
                    },
                ],
            },
        });

        res.json({
            transcription: response.text || '',
            success: true,
        });
    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({
            error: 'Failed to transcribe audio',
            code: 'TRANSCRIPTION_ERROR',
        });
    }
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);

    // CORS errors
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'Forbidden', code: 'CORS_ERROR' });
    }

    // JSON parsing errors
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON', code: 'PARSE_ERROR' });
    }

    // Payload too large
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Request too large', code: 'PAYLOAD_TOO_LARGE' });
    }

    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
});

// =============================================================================
// STATIC FILE SERVING (Production)
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

// =============================================================================
// SERVER START
// =============================================================================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Gemini API: ${ai ? 'configured' : 'NOT CONFIGURED'}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
