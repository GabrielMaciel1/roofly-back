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

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await AppDataSource.initialize();
        app.listen(PORT, () => {
        });
    } catch (error) {
        process.exit(1); // Exit the process if database connection fails
    }
}

startServer();
