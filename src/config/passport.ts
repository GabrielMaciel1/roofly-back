import passport from 'passport';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await userRepository.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

/*
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID as string,
    clientSecret: process.env.FACEBOOK_APP_SECRET as string,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await AuthService.findOrCreateSocialUser(profile.id, profile.emails?.[0].value as string, 'facebook');
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));
*/

/*
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await AuthService.findOrCreateSocialUser(profile.id, profile.emails?.[0].value as string, 'google');
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));
*/
