import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Alert } from '../alerts/alert.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts: Alert[];
}
