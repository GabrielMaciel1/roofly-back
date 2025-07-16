import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';

export enum OtpPurpose {
    RESET_PASSWORD = 'reset_password',
}

@Entity({ name: 'otps' })
export class Otp {
    @PrimaryColumn({ type: 'uuid' })
    id!: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId!: string;

    @ManyToOne(() => User, user => user.otps, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'char', length: 6 })
    code!: string;

    @Column({ type: 'enum', enum: OtpPurpose })
    purpose!: OtpPurpose;

    @Column({ type: 'timestamp', name: 'expires_at' })
    expiresAt!: Date;

    @Column({ type: 'boolean', default: false })
    used!: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'created_at' })
    createdAt!: Date;
}
