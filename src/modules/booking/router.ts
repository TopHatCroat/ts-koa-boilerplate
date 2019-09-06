import Router from "koa-router";

import { respondWithError } from "../shared/response";
import { regexValidated } from "../shared/validation";
import authenticated from "../auth/middleware/authenticated";
import adminOnly from "../auth/middleware/adminOnly";
import BookingSchema from "./model/BookingSchema";
import generateConfirmationCode from "./confirmationCode/generate";
import { NotFoundError } from "../shared/AppError";
import IBooking from "./model/BookingModel"

const router = new Router();

router.post('/booking',
    async (ctx) => {
        const data = ctx.request.body;

        const booking: IBooking = {
            email: regexValidated(data.email, /.*@.*/, "Invalid email"),
            firstName: regexValidated(data.firstName, /.+/, "Must provide first name"),
            lastName: regexValidated(data.firstName, /.+/, "Must provide first name"),
            phoneNumber: regexValidated(data.firstName, /.+/, "Must provide first name"),
        };

        const docCount = await BookingSchema.count({});
        booking.confirmationCode = generateConfirmationCode(docCount);

        const newDoc = new BookingSchema(booking);
        await newDoc.save();

        ctx.status = 201;
        ctx.body = booking;
    }
);

router.get('/booking',
    authenticated,
    adminOnly,
    async (ctx) => {
        const allBookings = await BookingSchema.find({}).lean();

        const response: IBooking[] = [];
        for (const booking of allBookings) {
            response.push(booking as IBooking);
        }

        ctx.status = 200;
        ctx.body = response;
    }
);

router.delete('/booking/:id',
    authenticated,
    adminOnly,
    async (ctx) => {
        const deletedCount = await BookingSchema.deleteOne({ _id: ctx.params.id });
        if (deletedCount) {
            ctx.status = 200;
        } else {
            respondWithError(ctx, new NotFoundError())
        }
    }
);

export default router;
