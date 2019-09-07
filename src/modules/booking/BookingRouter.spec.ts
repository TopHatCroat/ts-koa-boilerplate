import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";

import app from "../../app";
import { config } from "../../config";
import EmailSender from "../../service/EmailSender";
import { InvalidCredentialsError, InvalidCredentialsFormatError } from "../auth/errors";
import { createJwtToken } from "../auth/token/jwt";
import Role from "../auth/model/Role";
import IBooking from "./model/IBooking";
import BookingRepository from "./BookingRepository";
import SpyInstance = jest.SpyInstance;

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer: MongoMemoryServer;
const validToken = `Bearer ${createJwtToken(config.adminEmail, Role.Admin)}`;
const bookingRepository = new BookingRepository();

beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, { useNewUrlParser: true }, (err) => {
        if (err) {
            console.error(err);
        }
    });
});

afterEach(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Booking router", () => {
    it("Responds with unauthenticated if valid token not set", async () => {
        const response = await supertest(app.callback())
            .get("/bookings");

        expect(response.status).toEqual(401);
        expect(response.body.message).toEqual((new InvalidCredentialsFormatError()).message);
    });

    it("Responds with unauthenticated if invalid token set", async () => {
        const response = await supertest(app.callback())
            .get("/bookings")
            .set({ Authorization: "Bearer: invalid token"});

        expect(response.status).toEqual(401);
        expect(response.body.message).toEqual((new InvalidCredentialsError()).message);
    });

    it("Responds with list of bookings", async () => {
        const booking = await bookingRepository.create({
            email: "example@mail.com",
            firstName: "bob",
            lastName: "smith",
            phoneNumber: "123123132",
        });

        const response = await supertest(app.callback())
            .get("/bookings")
            .set({ Authorization: validToken});

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].email).toEqual(booking.email);
        expect(response.body[0].firstName).toEqual(booking.firstName);
        expect(response.body[0].lastName).toEqual(booking.lastName);
        expect(response.body[0].phoneNumber).toEqual(booking.phoneNumber);
        expect(response.body[0].confirmationCode).toMatch(/\w{8}/);
    });

    it("Responds with booking when creating a new booking", async () => {
        jest.mock("../../service/email");
        const emailSenderSpy: SpyInstance = jest.spyOn(EmailSender.prototype, "sendInvitation");

        const booking: IBooking = {
            email: "example@mail.com",
            firstName: "bob",
            lastName: "smith",
            phoneNumber: "123123132",
        };

        const response = await supertest(app.callback())
            .post("/booking")
            .send(booking);

        expect(response.status).toEqual(201);
        expect(response.body.email).toEqual(booking.email);
        expect(response.body.firstName).toEqual(booking.firstName);
        expect(response.body.lastName).toEqual(booking.lastName);
        expect(response.body.phoneNumber).toEqual(booking.phoneNumber);
        expect(response.body.confirmationCode).toMatch(/\w{8}/);

        expect(emailSenderSpy).toHaveBeenCalledWith(response.body.email, response.body.confirmationCode);
    });

    it("Responds with ok when deleting a booking", async () => {
        const booking = await bookingRepository.create({
            email: "example@mail.com",
            firstName: "bob",
            lastName: "smith",
            phoneNumber: "123123132",
        });

        const response = await supertest(app.callback())
            .delete(`/booking/${booking.id}`)
            .set({ Authorization: validToken});

        expect(response.status).toEqual(200);
    });

    it("Responds with not found when deleting a non existent booking", async () => {
        const response = await supertest(app.callback())
            .delete(`/booking/does_not_exist`)
            .set({ Authorization: validToken});

        expect(response.status).toEqual(404);
    });

    it("Responds with not authenticated when deleting a non booking without auth", async () => {
        const booking = await bookingRepository.create({
            email: "example@mail.com",
            firstName: "bob",
            lastName: "smith",
            phoneNumber: "123123132",
        });

        const response = await supertest(app.callback())
            .delete(`/booking/${booking.id}`);

        expect(response.status).toEqual(401);
    });
});
