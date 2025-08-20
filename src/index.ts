import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import advertisementRoutes from './routes/advertisement';
import passport from 'passport';
import session from 'express-session';
import './config/passport';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/advertisements', advertisementRoutes);

// Rotas de autenticação social
/*
app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        // Autenticação bem-sucedida, redirecionar ou enviar token
        res.redirect('/');
    }
);

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Autenticação bem-sucedida, redirecionar ou enviar token
        res.redirect('/');
    }
);
*/

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1); // Exit the process if database connection fails
    }
}

startServer();
