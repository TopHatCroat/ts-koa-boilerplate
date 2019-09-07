import { ObjectId } from "../../service/mongo";
import BookingSchema, { SchemaType } from "./model/BookingSchema";
import IBooking from "./model/BookingModel";
import generateConfirmationCode from "./confirmationCode/generate";
import {NotFoundError} from "../shared/appErrors";

function mapBooking(booking: SchemaType): IBooking {
    return {
        id: booking._id.toString(),
        email: booking.email,
        firstName: booking.firstName,
        lastName: booking.lastName,
        phoneNumber: booking.phoneNumber,
        confirmationCode: booking.confirmationCode,
        attendedAt: booking.attendedAt,
    }
}

class BookingRepository {

    async findAll(): Promise<IBooking[]> {
        const allBookings = await BookingSchema.find({}).lean();

        const result: IBooking[] = [];
        for (const booking of allBookings) {
            result.push(mapBooking(booking));
        }

        return result;
    }

    async create(booking: IBooking): Promise<IBooking> {
        const docCount = await BookingSchema.countDocuments();
        booking.confirmationCode = generateConfirmationCode(docCount);

        const newDoc = new BookingSchema(booking);
        await newDoc.save();
        return mapBooking(newDoc);
    }

    async delete(id: ObjectId): Promise<boolean> {
        try {
            const res = await BookingSchema.deleteOne({ _id: id });
            return res.ok == 1;
        } catch {
            return false;
        }
    }
}

export default new BookingRepository();
