import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Task {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public title!: string;

  @Column()
  public description!: string;

  @Column({ type: 'varchar', length: 32 })
  public status!: 'pending' | 'in progress' | 'done';
}
