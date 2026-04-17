import { db } from "./db";
import {
  resumes,
  type InsertResume,
  type Resume
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: number): Promise<Resume | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(insertResume).returning();
    return resume;
  }

  async getResume(id: number): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }
}

export const storage = new DatabaseStorage();
