import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRespository:Repository<User>){}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword= await bcrypt.hash(createUserDto.password,10);
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    const user=this.userRespository.create({
      ...createUserDto,
      password:hashedPassword
    })
    await this.userRespository.save(user);
    return user;
  }

   async findAll() {
    return await this.userRespository.find();
  }

  async findOne(id: number) {
    const checkUser = await this.userRespository.findOneBy({id})
    if(!checkUser) throw new NotFoundException("User Not Found");

    return checkUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const checkUser = await this.userRespository.findOneBy({id})
    if(!checkUser) throw new NotFoundException("User Not Found");
    let hashedPassword = checkUser.password;
    if(updateUserDto.password){
      hashedPassword = await bcrypt.hash(updateUserDto.password,10);
    }
    const user=await this.userRespository.preload({
      id,
      ...updateUserDto,
      password:hashedPassword
    });

    if(!user) throw new NotFoundException("User not updated");
    await this.userRespository.save(user);


    return user;
  }

  async remove(id: number) {
    const checkUser = await this.userRespository.findOneBy({id});
    if(!checkUser) throw new NotFoundException("User Not Found");
    await this.userRespository.remove(checkUser);
    return {message:"User deleted"};
  }
}




/*

// CREATE / WRITE
const userEntity = repository.create(dto);          // DTO -> Entity mapping qiladi, DB ga yozmaydi
await repository.save(userEntity);                  // Insert yoki update qiladi, DB ga yozadi
await repository.insert(dto);                       // Tez insert, lifecycle hook ishlamaydi
await repository.update(id, dto);                  // ID yoki condition bo‘yicha update
await repository.upsert(dto, ['email']);           // Insert yoki update (Postgres/MySQL 8+)
const preloadedUser = await repository.preload({ id, ...dto }); // Update qilish uchun entityni tayyorlaydi
repository.merge(userEntity, dto);                 // Entity ustiga fieldlarni qo‘shadi

// READ / TEKSHIRISH
const oneUserByEmail = await repository.findOneBy({ email: dto.email });                // Shart bo‘yicha 1ta entity
const oneUserWithRelations = await repository.findOne({ where: { email: dto.email }, relations: ['posts'] }); // Filter + relations bilan 1ta entity
const activeUsers = await repository.findBy({ isActive: true });                        // Filter bilan list
const allUsers = await repository.find();                                               // Hammasini list bilan
const emailExists = await repository.exist({ where: { email: dto.email } });           // Boolean qaytaradi, faqat bor-yo‘qligini tekshiradi
const adminCount = await repository.countBy({ role: 'admin' });                        // Filter bilan count
const totalCount = await repository.count();                                           // Hammasini count

// DELETE / O‘CHIRISH
await repository.delete(id);          // ID yoki condition bo‘yicha o‘chiradi
await repository.softDelete(id);      // DeletedAt bilan o‘chiradi
await repository.restore(id);         // Soft deleted entity ni tiklaydi
await repository.clear();             // Hammasini o‘chiradi

// RAW QUERY / TRANSACTION
const rawUsers = await repository.query('SELECT * FROM user'); // Raw SQL query ishlatish
await repository.manager.save(userEntity);                     // Transaction ichida ishlash

*/