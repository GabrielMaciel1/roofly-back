import { AppDataSource } from '../data-source';
import { Otp, OtpPurpose } from '../models/Otp';
import { Repository } from 'typeorm';

export class OtpRepository {
  private repository: Repository<Otp>;

  constructor() {
    this.repository = AppDataSource.getRepository(Otp);
  }

  create(otpData: Partial<Otp>): Otp {
    return this.repository.create(otpData);
  }

  async save(otp: Otp): Promise<Otp> {
    return this.repository.save(otp);
  }

  async findByEmailAndCode(email: string, code: string, purpose: OtpPurpose): Promise<Otp | null> {
    return this.repository.findOne({
      where: { email, code, purpose, used: false },
    });
  }

  async findActiveOtpByEmail(email: string, purpose: OtpPurpose): Promise<Otp | null> {
    return this.repository.findOne({
      where: { email, purpose, used: false },
      order: { createdAt: 'DESC' },
    });
  }
}
