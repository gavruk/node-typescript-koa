import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

export class SignUpModel {
    @Length(2, 30)
    firstName: string;

    @Length(2, 30)
    lastName: string;

    @IsEmail()
    email: string;

    @Length(6, 30)
    password: string;
}
