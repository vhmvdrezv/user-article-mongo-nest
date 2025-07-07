export default () => ({
    database: {
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/user-article-db',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    },
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    cors: {
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3003'
    },
});