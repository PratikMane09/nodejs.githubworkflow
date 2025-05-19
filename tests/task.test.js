import request from "supertest";
import mongoose from "mongoose";
import { Types } from "mongoose";
import dotenv from "dotenv";
import app from "../src/app.js";
import Task from "../src/models/Task.js";

// Load environment variables
dotenv.config();

describe("Task API", () => {
  // Connect to the database before running any tests
  beforeAll(async () => {
    try {
      // Use actual MongoDB URI from .env file or fallback to local test database
      const mongoUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/task-api-test";
      await mongoose.connect(mongoUri);
      console.log("Connected to the test database");
    } catch (error) {
      console.error("Database connection error:", error);
    }
  });

  // Disconnect after all tests are done
  afterAll(async () => {
    await mongoose.disconnect();
    console.log("Disconnected from test database");
  });

  // Clear the database before each test
  beforeEach(async () => {
    await Task.deleteMany({});
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks", async () => {
      // Create test tasks
      await Task.create([
        {
          title: "Test Task 1",
          description: "Test Description 1",
          status: "pending",
          priority: "low",
        },
        {
          title: "Test Task 2",
          description: "Test Description 2",
          status: "in-progress",
          priority: "high",
        },
      ]);

      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should return a single task", async () => {
      const task = await Task.create({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "medium",
      });

      const res = await request(app).get(`/api/tasks/${task._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Test Task");
    });

    it("should return 404 if task not found", async () => {
      const nonExistentId = new Types.ObjectId();
      const res = await request(app).get(`/api/tasks/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const taskData = {
        title: "New Task",
        description: "New Description",
        status: "pending",
        priority: "medium",
        dueDate: new Date().toISOString(),
      };

      const res = await request(app).post("/api/tasks").send(taskData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("New Task");

      const task = await Task.findById(res.body.data._id);
      expect(task).not.toBeNull();
    });

    it("should return 400 if title is missing", async () => {
      const res = await request(app).post("/api/tasks").send({
        description: "Invalid Task",
        status: "pending",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update a task", async () => {
      const task = await Task.create({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "medium",
      });

      const res = await request(app).put(`/api/tasks/${task._id}`).send({
        title: "Updated Task",
        status: "completed",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Updated Task");
      expect(res.body.data.status).toBe("completed");

      const updatedTask = await Task.findById(task._id);
      expect(updatedTask.title).toBe("Updated Task");
    });

    it("should return 404 if task not found", async () => {
      const nonExistentId = new Types.ObjectId();
      const res = await request(app).put(`/api/tasks/${nonExistentId}`).send({
        title: "Updated Task",
      });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      const task = await Task.create({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "medium",
      });

      const res = await request(app).delete(`/api/tasks/${task._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it("should return 404 if task not found", async () => {
      const nonExistentId = new Types.ObjectId();
      const res = await request(app).delete(`/api/tasks/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
