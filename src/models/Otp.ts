import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';

export enum OtpPurpose {
    RESET_PASSWORD = 'reset_password',
    VERIFY_EMAIL = 'verify_email', // Adicionado para verificação de e-mail
}

@Entity({ name: 'otps' })
export class Otp {
    @PrimaryColumn({ type: 'uuid' })
    id!: string;

    @Column({ type: 'uuid', name: 'user_id', nullable: true }) // Tornar userId opcional
    userId?: string;

    @ManyToOne(() => User, user => user.otps, { onDelete: 'CASCADE', nullable: true }) // Tornar user opcional
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @Column({ type: 'varchar', length: 150, nullable: true }) // Adicionar campo email
    email?: string;

    @Column({ type: 'char', length: 6 })
    code!: string;

    @Column({ type: 'enum', enum: OtpPurpose })
    purpose!: OtpPurpose;

    @Column({ type: 'timestamp', name: 'expires_at' })
    expiresAt!: Date;

    @Column({ type: 'varchar', length: 150, nullable: true })
    fullName?: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash' })
    passwordHash?: string;

    @Column({ type: 'boolean', default: false })
    used!: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'created_at' })
    createdAt!: Date;
}
