import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("users")
export class UsersEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  @Index()
  first_name: string;

  @Column()
  password: string;

  @Column({ type: "jsonb" })
  address?: any;

  static of(data: UsersEntity): UsersEntity {
    const result = new UsersEntity();
    Object.assign(result, data);
    return result;
  }
}
