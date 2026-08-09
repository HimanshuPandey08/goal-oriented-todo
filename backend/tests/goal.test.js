require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const userModel = require("../src/models/user.model");
const goalModel = require("../src/models/goal.model");

let mongoServer;
let testUser;
let token;



beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    testUser = await userModel.create({
        username: "goaltestuser",
        email: "goaltest@example.com",
        password: "hashedpassword"
    });

    token = jwt.sign(
        {
            id: testUser._id,
            username: testUser.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );


});



afterAll(async () => {

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});





test("should create a goal with proper input", async () => {
    
    const response = await request(app)
    .post("/api/goals")
    .send({
        title:"Create a goal",
        description:"this should be working."
    })
    .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(201)
    expect(response.body.goal.userId.toString())
    .toBe(testUser._id.toString());
    expect(response.body.message).toBe("Goal created successfully")
})


test("should reject a creating goal without title", async () => {
    
    const response = await request(app)
    .post("/api/goals")
    .send({
        description:"this should be working."
    })
    .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe("Title is required")
})

test("should create a goal with proper input but without description ", async () => {
    
    const response = await request(app)
    .post("/api/goals")
    .send({
        title:"Create a goal 2",
    })
    .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(201)
    expect(response.body.goal.description).toBeUndefined();
    expect(response.body.message).toBe("Goal created successfully")
})





// testing get all goals api


test("should gives all goals of the particular user", async () => {
    
    const response = await request(app)
    .get("/api/goals")
    .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe("Goals Fectched successfully")
    expect(response.body.goals[0].title).toBe("Create a goal")
    expect(response.body.goals[1].title).toBe("Create a goal 2")
})



// get goal by Id 


test("should gives goal of the particular goal", async () => {

    const goal = await goalModel.create({
        title: "Get Single Goal",
        description: "Testing get goal by id",
        userId: testUser._id
    });
    const response = await request(app)
    .get(`/api/goals/${goal._id}`)
    .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe("Goal Found successfully")

})

test("should not gives goal of the particular goal", async () => {

    const fakeGoalId = new mongoose.Types.ObjectId();

    const response = await request(app)
    .get(`/api/goals/${fakeGoalId}`)
    .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe("Goal not found")

})

test("should gives goal of the particular goal", async () => {

    const goal = await goalModel.create({
        title: "Get Single Goal",
        description: "Testing get goal by id",
        userId: testUser._id
    });
    const response = await request(app)
    .get(`/api/goals/So much worng id formate`)
    .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe("Invalid Goal id Formate")

})





