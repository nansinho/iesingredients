import { z } from "zod";

// ─── Contact Form ──────────────────────────────────────
export const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100)
    .trim(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100)
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255)
    .trim()
    .toLowerCase(),
  company: z.string().max(200).trim().optional().default(""),
  phone: z.string().max(30).trim().optional().default(""),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(300)
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000)
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Sample Request ────────────────────────────────────
export const sampleRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).trim(),
  email: z.string().email("Invalid email").max(255).trim().toLowerCase(),
  company: z.string().max(200).trim().optional().default(""),
  phone: z.string().max(30).trim().optional().default(""),
  message: z.string().max(2000).trim().optional().default(""),
  items: z
    .array(
      z.object({
        code: z.string().min(1),
        name: z.string().min(1),
        category: z.string().min(1),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .min(1, "At least one item is required"),
});

export type SampleRequestData = z.infer<typeof sampleRequestSchema>;

// ─── Translation ───────────────────────────────────────
export const translateSchema = z.object({
  text: z.string().min(1).max(10000).trim(),
  source: z.enum(["fr", "en"]),
  target: z.enum(["fr", "en"]),
});

export type TranslateData = z.infer<typeof translateSchema>;

// ─── Revalidation ──────────────────────────────────────
export const revalidateSchema = z.object({
  path: z.string().min(1).max(500).startsWith("/").optional().default("/"),
});

// ─── Login ─────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email").max(255).trim().toLowerCase(),
  password: z.string().min(1, "Password is required").max(200),
});

// ─── Register ──────────────────────────────────────────
export const registerSchema = z.object({
  email: z.string().email("Invalid email").max(255).trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200)
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a digit"),
  fullName: z.string().min(1).max(200).trim(),
  company: z.string().max(200).trim().optional().default(""),
});
