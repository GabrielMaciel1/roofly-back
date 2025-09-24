import { OtpPurpose } from '../models/Otp';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { OtpRepository } from '../repositories/OtpRepository';
import { EmailService } from './EmailService';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class AuthService {
  private static userRepository = new UserRepository();
  private static profileRepository = new ProfileRepository();
  private static otpRepository = new OtpRepository();

  private static ensureJwtSecret(): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined');
    }
    return process.env.JWT_SECRET as string;
  }

  static async register(email: string, password: string, fullName: string) {
    if (await this.userRepository.findByEmail(email)) {
      throw new Error('User with this email already exists');
    }

    const otpCode = crypto.randomInt(1000, 10000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newOtp = await this.otpRepository.create({
      id: uuidv4(),
      email,
      code: otpCode,
      purpose: OtpPurpose.VERIFY_EMAIL,
      expiresAt,
      fullName,
      passwordHash: hashedPassword,
      used: false,
    });
    await this.otpRepository.save(newOtp);
    await EmailService.sendOtpEmail(email, otpCode);
    return { message: 'OTP sent successfully' };
  }

  static async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id }, this.ensureJwtSecret(), { expiresIn: '1h' });
    return { token, user };
  }

  static async verifyOtp(email: string, otp: string) {
    const foundOtp = await this.otpRepository.findByEmailAndCode(email, otp, OtpPurpose.VERIFY_EMAIL);
    const now = Date.now();
    if (
      !foundOtp ||
      foundOtp.used ||
      (foundOtp.expiresAt instanceof Date ? foundOtp.expiresAt.getTime() < now : new Date(foundOtp.expiresAt).getTime() < now)
    ) {
      throw new Error('Invalid or expired OTP');
    }

    foundOtp.used = true;
    await this.otpRepository.save(foundOtp);

    if (!foundOtp.fullName || !foundOtp.passwordHash) {
      throw new Error('Registration data not found for OTP verification');
    }

    if (await this.userRepository.findByEmail(email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = this.userRepository.create({ email, passwordHash: foundOtp.passwordHash, isVerified: true });
    await this.userRepository.save(newUser);

    const newProfile = this.profileRepository.create({
      userId: newUser.id,
      fullName: foundOtp.fullName,
    });
    await this.profileRepository.save(newProfile);

    const token = jwt.sign({ userId: newUser.id }, this.ensureJwtSecret(), { expiresIn: '1h' });
    return { user: newUser, token };
  }

  static async resendOtp(email: string) {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists && userExists.isVerified) {
      throw new Error('User already verified');
    }

    const activeOtp = await this.otpRepository.findActiveOtpByEmail(email, OtpPurpose.VERIFY_EMAIL);
    const now = Date.now();

    if (activeOtp && (activeOtp.expiresAt instanceof Date ? activeOtp.expiresAt.getTime() > now : new Date(activeOtp.expiresAt).getTime() > now)) {
      await EmailService.sendOtpEmail(email, activeOtp.code);
      return { message: 'Existing OTP re-sent successfully' };
    } else {
      const otpCode = crypto.randomInt(1000, 10000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      if (activeOtp) {
        activeOtp.used = true;
        await this.otpRepository.save(activeOtp);
      }

      const newOtp = await this.otpRepository.create({
        id: uuidv4(),
        email,
        code: otpCode,
        purpose: OtpPurpose.VERIFY_EMAIL,
        expiresAt,
        used: false,
      });
      await this.otpRepository.save(newOtp);
      await EmailService.sendOtpEmail(email, otpCode);
      return { message: 'New OTP sent successfully' };
    }
  }
}
