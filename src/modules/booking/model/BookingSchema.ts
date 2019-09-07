import * as mongoose from "mongoose";
import IBooking from "./BookingModel";

type SchemaType = IBooking & mongoose.Document;

const schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    confirmationCode: { type: String, required: true, unique: true },
    attendedAt: { type: Date },
});

const model = mongoose.model<SchemaType>("Booking", schema);

export { SchemaType };
export default model;
