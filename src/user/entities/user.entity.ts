import { Post } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    username:string;
    @Column()
    surname:string;
    @Column({unique:true})
    email:string;
    @Column()
    password:string;
    @CreateDateColumn()
    createdAt:Date;

    @OneToMany(()=>Post,post=>post.user)
    posts:Post[];


}
