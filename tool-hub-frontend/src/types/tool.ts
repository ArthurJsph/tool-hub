import { z } from "zod";

export const toolSchema = z.object({
  id: z.number().optional(),
  key: z.string().min(1, "Key is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  href: z.string().optional(),
  active: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Tool = z.infer<typeof toolSchema>;

export const toolStatusSchema = z.object({
  status: z.boolean(),
});

export type ToolStatus = z.infer<typeof toolStatusSchema>;
