require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const userModel = require("../src/models/user.model");
const goalModel = require("../src/models/goal.model");
const milestoneModel = require("../src/models/milestone.model");
const taskModel = require("../src/models/task.model");

let mongoServer;
let testUser;
let testGoal;
let token;

beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    testUser = await userModel.create({
        username: "tasktestuser",
        email: "tasktest@example.com",
        password: "hashedpassword"
    });

    testGoal = await goalModel.create({
        title: "Task Test Goal",
        description: "Goal for task testing",
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






// create task api testing

test("should reject task when title is missing", async () => {

    const milestone = await milestoneModel.create({
        title: "JavaScript Milestone",
        description: "Learn JavaScript",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .post(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks`)
        .send({
            description: "Learn DOM"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message)
        .toBe("Task title is required ");
});


test("should reject task when milestone is not found", async () => {

    const fakeMilestoneId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .post(`/api/goals/${testGoal._id}/milestones/${fakeMilestoneId}/tasks`)
        .send({
            title: "Learn DOM"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe("Milestone not found");
});


test("should reject task when milestone does not belong to the specified goal", async () => {

    const anotherGoal = await goalModel.create({
        title: "Another Goal",
        description: "Another goal",
        userId: testUser._id
    });

    const milestone = await milestoneModel.create({
        title: "Another Goal Milestone",
        description: "Belongs to another goal",
        userId: testUser._id,
        goalId: anotherGoal._id
    });

    const response = await request(app)
        .post(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks`)
        .send({
            title: "Learn DOM"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe("Milestone not found");
});


test("should reject task when milestone belongs to another user", async () => {

    const anotherUser = await userModel.create({
        username: "anothertaskuser",
        email: "anothertask@example.com",
        password: "hashedpassword"
    });

    const milestone = await milestoneModel.create({
        title: "Another User Milestone",
        description: "Belongs to another user",
        userId: anotherUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .post(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks`)
        .send({
            title: "Unauthorized Task"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message)
        .toBe("Milestone not found");
});


test("should create task with proper input", async () => {

    const milestone = await milestoneModel.create({
        title: "JavaScript Milestone",
        description: "Learn JavaScript",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const response = await request(app)
        .post(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks`)
        .send({
            title: "Learn DOM",
            description: "Complete DOM fundamentals"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Task created successfully");
    expect(response.body.task.title).toBe("Learn DOM");
    expect(response.body.task.description).toBe("Complete DOM fundamentals");
    expect(response.body.task.completed).toBe(false);
});



// get all task api tested 



beforeEach(async () => {
    await milestoneModel.deleteMany({});
    await taskModel.deleteMany({});
});




test("should fetch all tasks of the particular milestone", async () => {

    const milestone = await milestoneModel.create({
        title: "JavaScript Milestone",
        description: "Learn JavaScript",
        userId: testUser._id,
        goalId: testGoal._id
    });

    await taskModel.create([
        {
            title: "Learn DOM",
            description: "Complete DOM",
            userId: testUser._id,
            goalId: testGoal._id,
            milestoneId: milestone._id
        },
        {
            title: "Learn Events",
            description: "Complete Events",
            userId: testUser._id,
            goalId: testGoal._id,
            milestoneId: milestone._id
        }
    ]);

    const response = await request(app)
        .get(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.tasks).toHaveLength(2);
    expect(response.body.tasks[0].title).toBe("Learn DOM");
    expect(response.body.tasks[1].title).toBe("Learn Events");
});



// edit task by id api testing



beforeEach(async () => {
    await milestoneModel.deleteMany({});
    await taskModel.deleteMany({});
});


test("should update task successfully", async () => {

    const milestone = await milestoneModel.create({
        title: "JavaScript Milestone",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const task = await taskModel.create({
        title: "Old Task",
        description: "Old Description",
        userId: testUser._id,
        goalId: testGoal._id,
        milestoneId: milestone._id
    });

    const response = await request(app)
        .patch(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks/${task._id}`)
        .send({
            title: "Updated Task",
            completed: true
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Task updated successfully");
    expect(response.body.task.title).toBe("Updated Task");
    expect(response.body.task.completed).toBe(true);
});


test("should not update when task is not found", async () => {

    const milestone = await milestoneModel.create({
        title: "JavaScript Milestone",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const fakeTaskId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .patch(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks/${fakeTaskId}`)
        .send({
            title: "Updated Task"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task not found");
});


test("should not update task when milestone does not match", async () => {

    const milestone1 = await milestoneModel.create({
        title: "Milestone 1",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const milestone2 = await milestoneModel.create({
        title: "Milestone 2",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const task = await taskModel.create({
        title: "Test Task",
        userId: testUser._id,
        goalId: testGoal._id,
        milestoneId: milestone1._id
    });

    const response = await request(app)
        .patch(`/api/goals/${testGoal._id}/milestones/${milestone2._id}/tasks/${task._id}`)
        .send({
            title: "Unauthorized Update"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task not found");
});


test("should not update task when goal does not match", async () => {

    const anotherGoal = await goalModel.create({
        title: "Another Goal",
        userId: testUser._id
    });

    const milestone = await milestoneModel.create({
        title: "Milestone",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const task = await taskModel.create({
        title: "Test Task",
        userId: testUser._id,
        goalId: testGoal._id,
        milestoneId: milestone._id
    });

    const response = await request(app)
        .patch(`/api/goals/${anotherGoal._id}/milestones/${milestone._id}/tasks/${task._id}`)
        .send({
            title: "Unauthorized Update"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task not found");
});


test("should not update task when user does not match", async () => {

    const anotherUser = await userModel.create({
        username: "anotherupdateuser",
        email: "anotherupdate@example.com",
        password: "hashedpassword"
    });

    const milestone = await milestoneModel.create({
        title: "Another User Milestone",
        userId: anotherUser._id,
        goalId: testGoal._id
    });

    const task = await taskModel.create({
        title: "Another User Task",
        userId: anotherUser._id,
        goalId: testGoal._id,
        milestoneId: milestone._id
    });

    const response = await request(app)
        .patch(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks/${task._id}`)
        .send({
            title: "Unauthorized Update"
        })
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task not found");
});



// delete task by id api testing 


beforeEach(async () => {
    await milestoneModel.deleteMany({});
    await taskModel.deleteMany({});
});



test("should delete task successfully", async () => {

    const milestone = await milestoneModel.create({
        title: "JavaScript Milestone",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const task = await taskModel.create({
        title: "Delete Task",
        userId: testUser._id,
        goalId: testGoal._id,
        milestoneId: milestone._id
    });

    const response = await request(app)
        .delete(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks/${task._id}`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Task deleted successfully");
});


test("should not delete when task is not found", async () => {

    const milestone = await milestoneModel.create({
        title: "JavaScript Milestone",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const fakeTaskId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .delete(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks/${fakeTaskId}`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task not found");
});


test("should not delete task when milestone does not match", async () => {

    const milestone1 = await milestoneModel.create({
        title: "Milestone 1",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const milestone2 = await milestoneModel.create({
        title: "Milestone 2",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const task = await taskModel.create({
        title: "Test Task",
        userId: testUser._id,
        goalId: testGoal._id,
        milestoneId: milestone1._id
    });

    const response = await request(app)
        .delete(`/api/goals/${testGoal._id}/milestones/${milestone2._id}/tasks/${task._id}`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task not found");
});


test("should not delete task when goal does not match", async () => {

    const anotherGoal = await goalModel.create({
        title: "Another Goal",
        userId: testUser._id
    });

    const milestone = await milestoneModel.create({
        title: "Milestone",
        userId: testUser._id,
        goalId: testGoal._id
    });

    const task = await taskModel.create({
        title: "Test Task",
        userId: testUser._id,
        goalId: testGoal._id,
        milestoneId: milestone._id
    });

    const response = await request(app)
        .delete(`/api/goals/${anotherGoal._id}/milestones/${milestone._id}/tasks/${task._id}`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task not found");
});


test("should not delete task when user does not match", async () => {

    const anotherUser = await userModel.create({
        username: "anotherdeleteuser",
        email: "anotherdelete@example.com",
        password: "hashedpassword"
    });

    const milestone = await milestoneModel.create({
        title: "Another User Milestone",
        userId: anotherUser._id,
        goalId: testGoal._id
    });

    const task = await taskModel.create({
        title: "Another User Task",
        userId: anotherUser._id,
        goalId: testGoal._id,
        milestoneId: milestone._id
    });

    const response = await request(app)
        .delete(`/api/goals/${testGoal._id}/milestones/${milestone._id}/tasks/${task._id}`)
        .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Task not found");
});

































afterAll(async () => {

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});