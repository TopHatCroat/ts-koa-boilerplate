import Router, { RouterContext } from "koa-router";
import {body, middlewares, path, request, summary, tags} from "koa-swagger-decorator/dist";

import { NotFoundError } from "../shared/appErrors";
import { respondWithError } from "../shared/response";
import authenticated from "../auth/middleware/authenticated";
import adminOnly from "../auth/middleware/adminOnly";
import BookingSchema from "./model/BookingSchema";
import generateConfirmationCode from "./confirmationCode/generate";
import IBooking from "./model/BookingModel"
import bookingRepository from "./BookingRepository";
import EmailSender from "../../service/email";

const tag = tags(['booking']);

const bookingDescription = {
    email: { type: "string", required: true, example: "user@example.com" },
    firstName: { type: 'string', required: true, example: "Bob" },
    lastName: { type: 'string', required: true, example: "Smith" },
    phoneNumber: { type: 'string', required: true, example: "+1555112233" },
};

const emailSender = new EmailSender();

export default class BookingClass {

    @request("post", "/booking")
    @summary("Create new booking")
    @tag
    @body(bookingDescription)
    static async post(ctx: RouterContext) {
        const booking = ctx.validatedBody as IBooking;

        const createdBooking = await bookingRepository.create(booking);

        await emailSender.sendInvitation(createdBooking.email, createdBooking.confirmationCode!!);

        ctx.status = 201;
        ctx.body = createdBooking;
    }

    @request("get", "/bookings")
    @summary("Get all bookings")
    @tag
    @middlewares([authenticated, adminOnly])
    static async getAll(ctx: RouterContext) {
        const bookings = await bookingRepository.findAll();
        ctx.status = 200;
        ctx.body = bookings;
    }

    @request("delete", "/booking/{id}")
    @summary("Delete a booking")
    @tag
    @middlewares([authenticated, adminOnly])
    @path({
        id: { type: 'string', required: true, description: 'Booking ID' },
    })
    static async delete(ctx: RouterContext) {
        const { id } = ctx.validatedParams;
        const deleted = await bookingRepository.delete(id);
        if (deleted) {
            ctx.status = 200;
        } else {
            respondWithError(ctx, new NotFoundError())
        }
    }
}
