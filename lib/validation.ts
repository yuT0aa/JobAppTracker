import { z } from "zod";

export const applicationStatuses = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN"
] as const;

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .optional()
  .or(z.literal(""));

export const applicationInputSchema = z.object({
  company: z.string().trim().min(1, "Company is required.").max(120),
  role: z.string().trim().min(1, "Role is required.").max(160),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  url: optionalUrl,
  notes: z.string().trim().max(5000).optional().or(z.literal("")),
  status: z.enum(applicationStatuses).default("SAVED"),
  appliedAt: z.string().datetime().optional().nullable()
});

export const applicationPatchSchema = applicationInputSchema.partial();

export const companyInputSchema = z.object({
  name: z.string().trim().min(1, "Company name is required.").max(120),
  website: optionalUrl,
  location: z.string().trim().max(160).optional().or(z.literal("")),
  notes: z.string().trim().max(5000).optional().or(z.literal(""))
});

export const applicationQuerySchema = z.object({
  status: z.enum(applicationStatuses).optional(),
  search: z.string().trim().max(100).optional(),
  companyId: z.string().cuid().optional(),
  sort: z.enum(["updatedAt", "createdAt", "company", "role", "status"]).default("updatedAt"),
  direction: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12)
});

export type ApplicationInput = z.infer<typeof applicationInputSchema>;

const dateTime = z.string().datetime({ offset: true });

export const interviewInputSchema = z.object({
  applicationId: z.string().cuid(),
  type: z.enum(["PHONE", "VIDEO", "ONSITE", "PANEL", "OTHER"]).default("VIDEO"),
  scheduledAt: dateTime,
  duration: z.number().int().min(15).max(480).default(60),
  location: z.string().trim().max(240).optional().or(z.literal("")),
  notes: z.string().trim().max(5000).optional().or(z.literal(""))
});

export const taskInputSchema = z.object({
  applicationId: z.string().cuid().optional().nullable(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  dueAt: dateTime.optional().nullable()
});

export const reminderInputSchema = z.object({
  applicationId: z.string().cuid().optional().nullable(),
  title: z.string().trim().min(1).max(200),
  remindAt: dateTime,
});

export const contactInputSchema = z.object({
  companyId: z.string().cuid().optional().nullable(),
  name: z.string().trim().min(1).max(160),
  email: z.string().email().optional().or(z.literal("")),
  role: z.string().trim().max(160).optional().or(z.literal("")),
  linkedin: optionalUrl,
  notes: z.string().trim().max(5000).optional().or(z.literal(""))
});

export const documentInputSchema = z.object({
  applicationId: z.string().cuid().optional().nullable(),
  name: z.string().trim().min(1).max(200),
  kind: z.enum(["RESUME", "COVER_LETTER", "PORTFOLIO", "OTHER"]).default("OTHER"),
  url: z.string().trim().url(),
  mimeType: z.string().trim().max(120).optional().or(z.literal("")),
  size: z.number().int().positive().max(50_000_000).optional().nullable()
});

export const notificationInputSchema = z.object({
  type: z.enum(["REMINDER", "INTERVIEW", "SYSTEM"]).default("SYSTEM"),
  title: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(1000)
});
