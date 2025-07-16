import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Advertisement } from './Advertisement';

@Entity({ name: 'fotos_anuncio' })
export class AdvertisementPhoto {
    @PrimaryColumn({ type: 'uuid' })
    id!: string;

    @Column({ type: 'uuid', name: 'anuncio_id' })
    advertisementId!: string;

    @ManyToOne(() => Advertisement, advertisement => advertisement.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'anuncio_id' })
    advertisement!: Advertisement;

    @Column({ type: 'text' })
    url!: string;

    @Column({ type: 'int', name: 'sort_order', default: 0 })
    sortOrder!: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'created_at' })
    createdAt!: Date;
}
