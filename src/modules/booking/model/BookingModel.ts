import { ObjectId } from "../../../service/mongo";

export default interface IBooking {
    _id?: ObjectId;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    confirmationCode?: string;
    attendedAt?: Date;
}
