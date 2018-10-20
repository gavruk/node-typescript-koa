import { Document, Schema, Model, model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    fullName(): string;
}

export const UserSchema: Schema = new Schema({
    createdAt: Date,
    email: String,
    firstName: String,
    lastName: String
});
UserSchema.pre('save', (next) => {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});
UserSchema.methods.fullName = function(): string {
    return (this.firstName.trim() + ' ' + this.lastName.trim());
};

export const User: Model<IUser> = model<IUser>('User', UserSchema);
