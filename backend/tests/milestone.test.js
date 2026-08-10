require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const userModel = require("../src/models/user.model");
const goalModel = require("../src/models/goal.model");
const milestoneModel = require("../src/models/milestone.model");

let mongoServer;
let testUser;
let testGoal;
let token;

beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    testUser = await userModel.create({
        username: "milestonetestuser",
        email: "milestone@example.com",
        password: "hashedpassword"
    });

    testGoal = await goalModel.create({
        title: "Milestone Test Goal",
        description: "Goal for milestone testing",
        userId: testUser._id
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


// create milestone api testing

test("should create milestone with proper input", async () => {

    const response = await request(app)
        .post(`/api/goals/${testGoal._id}/milestones`)
        .send({
            title: "Complete JavaScript",
            description: "Finish JavaScript fundamentals"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("milestone created successfully");
    expect(response.body.milestone.title).toBe("Complete JavaScript");
    expect(response.body.milestone.description).toBe("Finish JavaScript fundamentals");
    expect(response.body.milestone.completed).toBe(false);
});


test("should reject milestone when title is missing", async () => {

    const response = await request(app)
        .post(`/api/goals/${testGoal._id}/milestones`)
        .send({
            description: "Finish JavaScript fundamentals"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message)
        .toBe("Title is required for the milestone to create");
});


test("should reject milestone when goal is not found", async () => {

    const fakeGoalId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .post(`/api/goals/${fakeGoalId}/milestones`)
        .send({
            title: "Complete JavaScript",
            description: "Finish JavaScript fundamentals"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Goal not found");
});


test("should reject milestone when goal belongs to another user", async () => {

    const anotherUser = await userModel.create({
        username: "anothermilestoneuser",
        email: "anothermilestone@example.com",
        password: "hashedpassword"
    });

    const anotherGoal = await goalModel.create({
        title: "Another User Goal",
        description: "This belongs to another user",
        userId: anotherUser._id
    });

    const response = await request(app)
        .post(`/api/goals/${anotherGoal._id}/milestones`)
        .send({
            title: "Unauthorized Milestone",
            description: "Should not be created"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Goal not found");
});




// get all milestones api testing

beforeEach(async () => {
    await milestoneModel.deleteMany({});
});

test("should fetch all milestones of the particular goal", async () => {

    const milestone1 = await milestoneModel.create({
        title: "Complete JavaScript",
        description: "Learn JavaScript",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const milestone2 = await milestoneModel.create({
        title: "Complete React",
        description: "Learn React",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .get(`/api/goals/${testGoal._id}/milestones`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.message)
        .toBe("All milestone fetched Successfully");

    expect(response.body.milestones).toHaveLength(2);

    expect(response.body.milestones[0].title)
        .toBe("Complete JavaScript");

    expect(response.body.milestones[1].title)
        .toBe("Complete React");
});















afterAll(async () => {

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});
