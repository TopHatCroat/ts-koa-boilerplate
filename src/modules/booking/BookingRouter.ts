import { RouterContext } from "koa-router";
import {body, middlewares, path, request, responses, security, summary, tags} from "koa-swagger-decorator/dist";

import EmailSender from "../../service/EmailSender";
import { NotFoundError } from "../shared/appError";
import { respondWithError } from "../shared/respondWithError";
import authenticated from "../auth/middleware/authenticated";
import adminOnly from "../auth/middleware/adminOnly";
import BookingRepository from "./BookingRepository";
import IBooking from "./model/IBooking";

const tag = tags(["booking"]);

const bookingDescription = {
    email: { type: "string", required: true, example: "user@example.com" },
    firstName: { type: "string", required: true, example: "Bob" },
    lastName: { type: "string", required: true, example: "Smith" },
    phoneNumber: { type: "string", required: true, example: "+1555112233" },
};

const bookingResponseDescription = {
    type: "object",
    properties: {
        id: { type: "string", description: "Booking ID" },
        email: { type: "string", description: "User email" },
        firstName: { type: "string", description: "User name" },
        lastName: { type: "string", description: "User last name" },
        phoneNumber: { type: "string", description: "User phone number" },
        confirmationCode: { type: "string", description: "Booking confirmation code" },
    },

};

const bookingErrorResponseDescription = {
    message: { type: "string" },
};

const emailSender = new EmailSender();
const bookingRepository = new BookingRepository();

export default class BookingRouter {

    @request("post", "/booking")
    @summary("Create new booking")
    @tag
    @responses({
        201: { description: "Booking create success", schema: bookingResponseDescription },
        429: { description: "Invalid data", schema: bookingErrorResponseDescription },
        409: { description: "Email already exists", schema: bookingErrorResponseDescription },
    })
    @body(bookingDescription)
    public static async Create(ctx: RouterContext) {
        const booking = ctx.validatedBody as IBooking;

        const createdBooking = await bookingRepository.create(booking);

        await emailSender.sendInvitation(createdBooking.email, createdBooking.confirmationCode!!);

        ctx.status = 201;
        ctx.body = createdBooking;
    }

    @request("get", "/bookings")
    @summary("Get all bookings")
    @tag
    @security([{ BearerAuth: [] }])
    @responses({
        200: { description: "Success", schema: { type: "array", items: bookingResponseDescription } },
        401: { description: "Invalid authentication", schema: bookingErrorResponseDescription },
    })
    @middlewares([authenticated, adminOnly])
    public static async GetAll(ctx: RouterContext) {
        const bookings = await bookingRepository.findAll();
        ctx.status = 200;
        ctx.body = bookings;
    }

    @request("delete", "/booking/{id}")
    @summary("Delete a booking")
    @tag
    @security([{ BearerAuth: [] }])
    @middlewares([authenticated, adminOnly])
    @responses({
        204: { description: "Success" },
        404: { description: "Booking not found", schema: bookingErrorResponseDescription },
        401: { description: "Invalid authentication", schema: bookingErrorResponseDescription },
    })
    @path({
        id: { type: "string", required: true, description: "Booking ID" },
    })
    public static async Delete(ctx: RouterContext) {
        const { id } = ctx.validatedParams;
        const deleted = await bookingRepository.delete(id);
        if (deleted) {
            ctx.status = 204;
        } else {
            respondWithError(ctx, new NotFoundError());
        }
    }
}
