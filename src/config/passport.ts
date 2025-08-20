import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User';
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

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string,
}, async (jwtPayload, done) => {
    try {
        const user = await userRepository.findById(jwtPayload.userId);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));
