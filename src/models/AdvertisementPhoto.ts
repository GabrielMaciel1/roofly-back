import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Advertisement } from './Advertisement';

@Entity({ name: 'fotos_anuncio' })
export class AdvertisementPhoto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid', name: 'anuncio_id' })
    advertisementId!: string;

    @ManyToOne(() => Advertisement, advertisement => advertisement.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'anuncio_id' })
    advertisement!: Advertisement;

    @Column({ type: 'text' })
    data!: string;

    @Column({ type: 'int', name: 'sort_order', default: 0 })
    sortOrder!: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'created_at' })
    createdAt!: Date;
}
