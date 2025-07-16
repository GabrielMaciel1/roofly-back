import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { AdvertisementPhoto } from './AdvertisementPhoto';
import { Favorite } from './Favorite';

export enum TransactionType {
    SALE = 'sale',
    RENT = 'rent',
}

@Entity({ name: 'anuncios' })
export class Advertisement {
    @PrimaryColumn({ type: 'uuid' })
    id!: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId!: string;

    @ManyToOne(() => User, user => user.advertisements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'varchar', length: 150 })
    title!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'varchar', length: 50, name: 'property_type' })
    propertyType!: string;

    @Column({ type: 'enum', enum: TransactionType, name: 'transaction_type' })
    transactionType!: TransactionType;

    @Column({ type: 'int' })
    bedrooms!: number;

    @Column({ type: 'varchar', length: 20 })
    cep!: string;

    @Column({ type: 'int', nullable: true })
    bathrooms?: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, name: 'area_m2', nullable: true })
    areaM2?: number;

    @Column({ type: 'int', name: 'garage_spaces', nullable: true })
    garageSpaces?: number;

    @Column({ type: 'numeric', precision: 12, scale: 2, name: 'condominium_fee', nullable: true })
    condominiumFee?: number;

    @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
    iptu?: number;

    @Column({ type: 'jsonb', name: 'property_details', nullable: true })
    propertyDetails?: object;

    @Column({ type: 'jsonb', name: 'condominium_details', nullable: true })
    condominiumDetails?: object;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    price!: number;

    @OneToMany(() => AdvertisementPhoto, photo => photo.advertisement)
    photos!: AdvertisementPhoto[];

    @OneToMany(() => Favorite, favorite => favorite.advertisement)
    favorites!: Favorite[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'updated_at' })
    updatedAt!: Date;
}
