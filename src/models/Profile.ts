import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'perfis' })
export class Profile {
    @PrimaryColumn({ type: 'uuid', name: 'user_id' })
    userId!: string;

    @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'varchar', length: 100, name: 'full_name' })
    fullName!: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    username!: string;

    @Column({ type: 'text', nullable: true, name: 'avatar_url' })
    avatarUrl?: string;

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'updated_at' })
    updatedAt!: Date;
}
