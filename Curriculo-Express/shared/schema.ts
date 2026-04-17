import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
// Although the basic version is client-side, we'll set up the table for future saving capability
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Meu Currículo"),
  content: jsonb("content").notNull(), // Stores the ResumeData structure
  createdAt: timestamp("created_at").defaultNow(),
});

// === ZOD SCHEMAS FOR FRONTEND FORMS ===

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  linkedin: z.string().optional(),
  location: z.string().optional(), // Cidade/Estado
  website: z.string().optional(),
  photo: z.string().optional(), // Base64 image data
});

export const experienceSchema = z.object({
  id: z.string().optional(), // for list management
  company: z.string().min(1, "Empresa é obrigatória"),
  position: z.string().min(1, "Cargo é obrigatório"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional(), // Empty string = Current/Atualmente
  current: z.boolean().default(false),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Instituição é obrigatória"),
  degree: z.string().min(1, "Curso/Grau é obrigatório"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Habilidade é obrigatória"),
  level: z.enum(["Básico", "Intermediário", "Avançado", "Fluente"]).optional(),
});

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  objective: z.string().optional(),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  templateId: z.enum(["modern", "classic", "minimal"]).default("modern"),
  color: z.string().default("#000000"),
});

// === DATABASE SCHEMAS ===
export const insertResumeSchema = createInsertSchema(resumes);

// === EXPLICIT TYPES ===
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type ResumeData = z.infer<typeof resumeDataSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
