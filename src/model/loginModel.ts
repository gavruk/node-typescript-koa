import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

export class LoginModel {
    @IsEmail()
    email: string;

    @Length(6, 30)
    password: string;
}
