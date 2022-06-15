import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
@Unique(['id'])
export class Photo {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  url: string;

  @Column()
  author: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'datetime' })
  createDate: Date;

  @ManyToMany(() => Tag, (tag) => tag.photos, {
    cascade: ['insert'],
  })
  @JoinTable()
  tags: Tag[];
}
