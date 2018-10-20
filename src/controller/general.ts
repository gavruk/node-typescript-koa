import { BaseContext } from 'koa';

export default class GeneralController {

    public static async helloWorld (ctx: BaseContext) {
        ctx.body = 'Hello World!';
    }

    public static async getJwtPayload (ctx: BaseContext) {
        ctx.status = 201;
        ctx.body = ctx.state.user;
    }

}
