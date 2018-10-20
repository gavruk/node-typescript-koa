import { BaseContext } from 'koa';
import { validate, ValidationError } from 'class-validator';
import { config } from '../config';
import { SignUpModel } from '../model/signUpModel';
import { LoginModel } from '../model/loginModel';
import { User, IUser } from '../entity/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export default class AuthController {

    public static async signUp (ctx: BaseContext) {
        const signUpUser: SignUpModel = {
            firstName: ctx.request.body.firstName,
            lastName: ctx.request.body.lastName,
            email: ctx.request.body.email,
            password: ctx.request.body.password,
        };

        const errors: ValidationError[] = await validate(signUpUser);

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        } else if (await User.findOne({ email: signUpUser.email }) ) {
            ctx.status = 400;
            ctx.body = 'The specified e-mail address already exists';
            return;
        }

        const passwordHash = await bcrypt.hash(ctx.request.body.password, 3);
        const userToBeSaved: IUser = new User({
            email: signUpUser.email,
            firstName: signUpUser.firstName,
            lastName: signUpUser.lastName,
            passwordHash,
        });
        const user = await userToBeSaved.save();
        ctx.status = 201;
        ctx.body = { success: true };
    }

    public static async login (ctx: BaseContext) {
        const loginUser: LoginModel = {
            email: ctx.request.body.email,
            password: ctx.request.body.password,
        };

        const errors: ValidationError[] = await validate(loginUser);

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }
        const user = await User.findOne({ email: loginUser.email });
        if (!user || !await bcrypt.compare(ctx.request.body.password, user.passwordHash)) {
            ctx.status = 400;
            ctx.body = 'Credentials are not valid';
            return;
        }
        const token = jwt.sign({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }, config.jwtSecret);
        ctx.status = 201;
        ctx.body = { success: true, token };
    }

}
