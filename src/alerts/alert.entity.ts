import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coin: string; // like "BTC" | "ETH"

  @Column('float')
  targetPrice: number;

  @Column({ default: 'active' }) // "active" | "triggered"
  status: string;

  @ManyToOne(() => User, (user) => user.alerts)
  user: User;
}
