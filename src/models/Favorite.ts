import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Advertisement } from './Advertisement';

@Entity({ name: 'favoritos' })
export class Favorite {
    @PrimaryColumn({ type: 'uuid', name: 'user_id' })
    userId!: string;

    @PrimaryColumn({ type: 'uuid', name: 'anuncio_id' })
    advertisementId!: string;

    @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Advertisement, advertisement => advertisement.favorites, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'anuncio_id' })
    advertisement!: Advertisement;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()', name: 'created_at' })
    createdAt!: Date;
}
