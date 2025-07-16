import 'reflect-metadata'
import 'dotenv/config'
import { DataSource } from 'typeorm'
import { User } from './models/User'
import { Profile } from './models/Profile'
import { Session } from './models/Session'
import { Otp } from './models/Otp'
import { Advertisement } from './models/Advertisement'
import { Favorite } from './models/Favorite'
import { AdvertisementPhoto } from './models/AdvertisementPhoto'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Profile, Session, Otp, Advertisement, Favorite, AdvertisementPhoto],
  migrations: [],
  subscribers: [],
})
