import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import passport from 'passport';
import session from 'express-session';
import './config/passport';

dotenv.config();

const app = express();
app.use(express.json());

app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

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

AppDataSource.initialize().then(() => {
    console.log('Database connected!');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log(error));
