import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'auth'})
export class Auth {
  @PrimaryGeneratedColumn()
id:String;
@Column()
fullName:String;
@Column()
username:String;
@Column()
companyName:String;
@Column({unique:true})
email:string;
@Column()
password:string;

}