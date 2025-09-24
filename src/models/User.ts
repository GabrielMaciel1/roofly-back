import { Entity, PrimaryColumn, Column, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './Profile';
import { Session } from './Session';
import { Otp } from './Otp';
import { Advertisement } from './Advertisement';
import { Favorite } from './Favorite';

@Entity({ name: 'usuarios' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255, name: 'password_hash' })
    passwordHash!: string;

    @Column({ type: 'boolean', default: false, name: 'is_verified' })
    isVerified!: boolean;

    @OneToOne(() => Profile, profile => profile.user)
    profile!: Profile;

    @OneToMany(() => Session, session => session.user)
    sessions!: Session[];

    @OneToMany(() => Otp, otp => otp.user)
    otps!: Otp[];

    @OneToMany(() => Advertisement, advertisement => advertisement.user)
    advertisements!: Advertisement[];

    @OneToMany(() => Favorite, favorite => favorite.user)
    favorites!: Favorite[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'updated_at' })
    updatedAt!: Date;
}
