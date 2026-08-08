require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const { authUser } = require("../src/middleware/auth.middleware")

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


    // login testing 


    test("Login api should response", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "1234567"
        })
        expect(response.statusCode).toBe(200);
        expect(response.body.message)
        .toBe("User Loggined Successfully");
    })

    test("should reject login when email is missing", async () => {
        const response = await request(app)
        .post("/api/auth/login")
        .send({
            password:"email is missing"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Email is missing")
    })

    test("should reject login when password is missing", async () => {
        const response = await request(app)
        .post("/api/auth/login")
        .send({
            email:"test@gmail.com"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Password is missing")
    })

    test("should reject login when email is incorrect formate", async () => {
        const response = await request(app)
        .post("/api/auth/login")
        .send({
            email:"email is incorrect",
            password:"email is incorrect"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Email is invalid")
    })

    test("should reject login when password is incorrect formate", async () => {
        const response = await request(app)
        .post("/api/auth/login")
        .send({
            email:"test@gmail.com",
            password:"pass"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Password is invalid")
    })

    test("should reject login when there is no user found", async () => {
        const response = await request(app)
        .post("/api/auth/login")
        .send({
            email:"TestUserNotExists@gmail.com",
            password:"1234567"
        })
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBe("User Dosn't Exists")
    })

    test("should reject login wehn password is incorrect",async () => {
        const response= await request(app)
        .post("/api/auth/login")
        .send({
            email: "test@example.com",
            password: "wrong password"
        })

        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Passowrd is incorrect")
    })

    test("should not return password in response", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "1234567"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.user)
            .not.toHaveProperty("password");
    });

    test("should return authentication cookie", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "1234567"
            });
        expect(response.statusCode).toBe(200);
        expect(response.headers["set-cookie"]).toBeDefined();
        expect(response.headers["set-cookie"][0])
            .toContain("token=");
    });

    const express = require("express");
    const testApp = express();
    const cookieParser = require("cookie-parser");
    const jwt = require("jsonwebtoken");

    testApp.use(cookieParser());
    testApp.use(express.json());

    testApp.get("/protected", authUser, (req, res) => {
        res.status(200).json({
            user: req.user
        });
    });

    test("should reject request when token is missing", async () => {
        const response = await request(testApp)
            .get("/protected");

        expect(response.statusCode).toBe(401);
        expect(response.body.message)
            .toBe("Token is missing");
    });

    const token = jwt.sign(
        {
            id: "123",
            username: "testuser"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    test("Valid token allows request to continue ", async () => {
        const response = await request(testApp)
            .get("/protected")
            .set("Cookie" ,`token=${token}`)
        expect(response.statusCode).toBe(200);
        expect(response.body.user.id)
            .toBe("123");
        expect(response.body.user.username)
            .toBe("testuser");
    });


    test("should reject the request wehn token is invalid", async () => {
        const response = await request(testApp)
            .get("/protected")
            .set("Cookie" ,`token=invalid-Token`)
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Token is invalid")
    });

    const expiredToken = jwt.sign(
        {
            id: "123",
            username: "testuser"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "-1s"
        }
    );
    test("should reject the request wehn token is expired", async () => {
        const response = await request(testApp)
            .get("/protected")
            .set("Cookie" ,`token=${expiredToken}`)
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Token is invalid")
    });
})
