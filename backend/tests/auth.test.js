require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});


describe("Auth Api",()=>{
    
    test("register api should response", async () => {
        const response = await request(app).post("/api/auth/register").send({
            username: "testuser",
            email: "test@example.com",
            password: "1234567"
        })
        expect(response.statusCode).toBe(201);

        expect(response.body.message)
        .toBe("User Registered Successfully");

        expect(response.body.user.username)
        .toBe("testuser");

        expect(response.body.user.email)
        .toBe("test@example.com");
    })

    test("should reject registration when username is missing", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: "missingusername@example.com",
                password: "1234567"
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message)
            .toBe("All Fields are required");
    });

    test("should reject registration when email is missing", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username:"EmailIsMissing",
                password: "1234567"
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message)
            .toBe("All Fields are required");
    });

    test("should reject registration when password is missing", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: "missingusername@example.com",
                username:"EmailIsMissing"
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("All Fields are required");
    });

    test("should reject registration wehn email is incorrect fomate" , async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: "InvaldEMail",
                username:"InvaldEMail",
                password:"12345678"
            });
        
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Email is invalid");
    })

    test("should reject registration wehn password is incorrect fomate" , async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: "valid@example.com",
                username:"InvaldPassword",
                password:"1234"
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Password should be atleat 6 character long.");
    })


    test("should reject registration when user laready exists with username", async () => {
        const response = await request(app)
        .post("/api/auth/register")
        .send({
            username: "testuser",
            email: "test2@example.com",
            password: "1234567"
        })
        expect(response.statusCode).toBe(409)
        expect(response.body.message).toBe("User Already exixts")
    })

    test("should reject registration when user laready exists with email", async () => {
        const response = await request(app)
        .post("/api/auth/register")
        .send({
            username: "testuser2",
            email: "test@example.com",
            password: "1234567"
        })
        expect(response.statusCode).toBe(409)
        expect(response.body.message).toBe("User Already exixts")
    })

    test("should not return password in response", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "NoPasswordUser",
                email: "nopassword@example.com",
                password: "1234567"
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.user)
            .not.toHaveProperty("password");
    });

    test("should return authentication cookie", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "CookieTestUser",
                email: "cookietest@example.com",
                password: "1234567"
            });
        expect(response.statusCode).toBe(201);
        expect(response.headers["set-cookie"]).toBeDefined();
        expect(response.headers["set-cookie"][0])
            .toContain("token=");
    });
})
