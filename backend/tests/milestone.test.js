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


// update milestone by id api testing 

beforeEach(async () => {
    await milestoneModel.deleteMany({});
});


test("should update milestone successfully", async () => {

    const milestone = await milestoneModel.create({
        title: "Old Title",
        description: "Old Description",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .patch(`/api/goals/${testGoal._id}/milestones/${milestone._id}`)
        .send({
            title: "Updated Title",
            description: "Updated Description",
            completed: true
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message)
        .toBe("milestone updated successfully");
    expect(response.body.milestone.title)
        .toBe("Updated Title");
    expect(response.body.milestone.description)
        .toBe("Updated Description");
    expect(response.body.milestone.completed)
        .toBe(true);
});


test("should not update milestone when milestone does not belong to the user", async () => {

    const anotherUser = await userModel.create({
        username: "anotheruser",
        email: "anotheruser@example.com",
        password: "hashedpassword"
    });

    const anotherMilestone = await milestoneModel.create({
        title: "Another User Milestone",
        description: "Another user milestone",
        userId: anotherUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .patch(`/api/goals/${testGoal._id}/milestones/${anotherMilestone._id}`)
        .send({
            title: "Unauthorized Update"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe("milestone not found");
});


test("should not update milestone when goal does not match", async () => {

    const anotherGoal = await goalModel.create({
        title: "Another Goal",
        description: "Another goal",
        userId: testUser._id
    });

    const milestone = await milestoneModel.create({
        title: "Test Milestone",
        description: "Test milestone",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .patch(`/api/goals/${anotherGoal._id}/milestones/${milestone._id}`)
        .send({
            title: "Unauthorized Update"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe("milestone not found");
});


test("should not update milestone when milestone does not exist", async () => {

    const fakeMilestoneId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .patch(`/api/goals/${testGoal._id}/milestones/${fakeMilestoneId}`)
        .send({
            title: "Updated Title"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe("milestone not found");
});




// delete milestone by id api testing 

beforeEach(async () => {
    await milestoneModel.deleteMany({});
});


test("should delete milestone successfully", async () => {

    const milestone = await milestoneModel.create({
        title: "Delete Milestone",
        description: "Milestone to delete",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .delete(`/api/goals/${testGoal._id}/milestones/${milestone._id}`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message)
        .toBe("milestone Deleted successfully");
});


test("should not delete milestone belonging to another user", async () => {

    const anotherUser = await userModel.create({
        username: "deleteanotheruser",
        email: "deleteanother@example.com",
        password: "hashedpassword"
    });

    const milestone = await milestoneModel.create({
        title: "Another User Milestone",
        description: "Should not be deleted",
        userId: anotherUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .delete(`/api/goals/${testGoal._id}/milestones/${milestone._id}`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe("milestone not found");
});


test("should not delete milestone when goal does not match", async () => {

    const anotherGoal = await goalModel.create({
        title: "Another Goal",
        description: "Different goal",
        userId: testUser._id
    });

    const milestone = await milestoneModel.create({
        title: "Test Milestone",
        description: "Belongs to original goal",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .delete(`/api/goals/${anotherGoal._id}/milestones/${milestone._id}`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe("milestone not found");
});


test("should not delete milestone when milestone does not exist", async () => {

    const fakeMilestoneId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .delete(`/api/goals/${testGoal._id}/milestones/${fakeMilestoneId}`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe("milestone not found");
});





afterAll(async () => {

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});
