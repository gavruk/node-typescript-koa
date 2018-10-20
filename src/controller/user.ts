import { BaseContext } from 'koa';
import { validate, ValidationError } from 'class-validator';
import { User, IUser } from '../entity/user';

export default class UserController {

    public static async getUsers (ctx: BaseContext) {
        const users: IUser[] = await User.find();

        ctx.status = 200;
        ctx.body = users;
    }

    public static async getUser (ctx: BaseContext) {
        const user: IUser = await User.findOne({ _id: ctx.params.id });

        if (user) {
            ctx.status = 200;
            ctx.body = user;
        } else {
            ctx.status = 400;
            ctx.body = 'The user you are trying to retrieve doesn\'t exist in the db';
        }
    }

    public static async createUser (ctx: BaseContext) {
        const userToBeSaved: IUser = new User({
            email: ctx.request.body.email,
            firstName: ctx.request.body.firstName,
            lastName: ctx.request.body.lastName,
        });

        const errors: ValidationError[] = await validate(userToBeSaved);

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = errors;
        } else if (await User.findOne({ email: userToBeSaved.email }) ) {
            ctx.status = 400;
            ctx.body = 'The specified e-mail address already exists';
        } else {
            const user = await userToBeSaved.save();
            ctx.status = 201;
            ctx.body = user;
        }
    }

    public static async updateUser (ctx: BaseContext) {
        const userToBeUpdated: IUser = new User({
            _id: ctx.params.id,
            firstName: ctx.request.body.firstName,
            lastName: ctx.request.body.lastName,
            email: ctx.request.body.email,
        });

        const errors: ValidationError[] = await validate(userToBeUpdated);

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = errors;
        } else if (!await User.findOne({ _id: userToBeUpdated._id })) {
            ctx.status = 400;
            ctx.body = 'The user you are trying to update doesn\'t exist in the db';
        } else if (await User.findOne({ _id: { $ne: userToBeUpdated._id }, email: userToBeUpdated.email })) {
            ctx.status = 400;
            ctx.body = 'The specified e-mail address already exists';
        } else {
            const user = await User.update({ _id: userToBeUpdated._id }, { $set: userToBeUpdated });
            ctx.status = 201;
            ctx.body = user;
        }
    }

    public static async deleteUser (ctx: BaseContext) {
        const userToRemove: IUser = await User.findOne({ _id: ctx.params.id });
        if (!userToRemove) {
            ctx.status = 400;
            ctx.body = 'The user you are trying to delete doesn\'t exist in the db';
        } else {
            await User.remove({ _id: userToRemove._id });
            ctx.status = 204;
        }
    }

}
