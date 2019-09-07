import { ObjectId } from "../../service/mongo";
import { NotFoundError } from "../shared/appError";
import BookingSchema, { SchemaType } from "./model/BookingSchema";
import generateValidationCode from "./confirmationCode/generateValidationCode";
import IBooking from "./model/IBooking";

function mapBooking(booking: SchemaType): IBooking {
    return {
        id: booking._id.toString(),
        email: booking.email,
        firstName: booking.firstName,
        lastName: booking.lastName,
        phoneNumber: booking.phoneNumber,
        confirmationCode: booking.confirmationCode,
        attendedAt: booking.attendedAt,
    };
}

class BookingRepository {

    public async findAll(): Promise<IBooking[]> {
        const allBookings = await BookingSchema.find({}).lean();

        const result: IBooking[] = [];
        for (const booking of allBookings) {
            result.push(mapBooking(booking));
        }

        return result;
    }

    public async create(booking: IBooking): Promise<IBooking> {
        const docCount = await BookingSchema.countDocuments();
        booking.confirmationCode = generateValidationCode(docCount);

        const newDoc = new BookingSchema(booking);
        await newDoc.save();
        return mapBooking(newDoc);
    }

    public async delete(id: ObjectId): Promise<boolean> {
        try {
            const res = await BookingSchema.deleteOne({ _id: id });
            return res.ok === 1;
        } catch {
            return false;
        }
    }
}

export default BookingRepository;
