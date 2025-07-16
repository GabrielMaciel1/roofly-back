import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'sessoes' })
export class Session {
    @PrimaryColumn({ type: 'uuid' })
    id!: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId!: string;

    @ManyToOne(() => User, user => user.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'text', unique: true })
    token!: string;

    @Column({ type: 'varchar', length: 255, name: 'device_info', nullable: true })
    deviceInfo?: string;

    @Column({ type: 'inet', name: 'ip_address', nullable: true })
    ipAddress?: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'created_at' })
    createdAt!: Date;

    @Column({ type: 'timestamp', name: 'expires_at' })
    expiresAt!: Date;
}
