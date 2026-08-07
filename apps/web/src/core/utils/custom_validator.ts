import { z } from "zod";

// ── Centralized Message Helpers ─────────────────────────────
const messages = {
  empty: (title: string) => `Please enter ${title.toLowerCase()}`,
  required: (title: string) => `Please Enter ${title}`,
  select: (title: string) => `Please select a ${title}`,
  minChar: (title: string, min: number) =>
    `${title} must be at least ${min} characters`,
  invalidFormat: (title: string) => `Enter a valid ${title}`,
  minVal: (title: string, min: number) => `${title} must be at least ${min}`,
  maxVal: (title: string, max: number) => `${title} must be at most ${max}`,
  phoneFormat: (title: string) =>
    `${title} must include a country code, digits only (e.g. +358401234567)`,
  lettersOnly: (title: string) =>
    `${title} must contain only letters and spaces`,
};

export const customValidator = {
  field: ({
    title,
    required = true,
    min = 1,
  }: {
    title: string;
    required?: boolean;
    min?: number;
  }) => {
    const base = z
      .string()
      .trim()
      .min(1, messages.empty(title))
      .min(min, messages.minChar(title, min));

    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, messages.required(title));
  },

  name: ({
    title,
    required = true,
    min = 1,
  }: {
    title: string;
    required?: boolean;
    min?: number;
  }) => {
    const base = z
      .string()
      .trim()
      .min(1, messages.empty(title))
      .min(min, messages.minChar(title, min))
      .regex(/^[a-zA-Z\s]+$/, messages.lettersOnly(title));

    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, messages.required(title));
  },

  fullName: ({
    title,
    required = true,
    min = 1,
  }: {
    title: string;
    required?: boolean;
    min?: number;
  }) => {
    const base = z
      .string()
      .trim()
      .min(1, messages.empty(title))
      .min(min, messages.minChar(title, min))
      .regex(
        /^\p{L}+(?:['-]\p{L}+)*(?:\s+\p{L}+(?:['-]\p{L}+)*)+$/u,
        messages.invalidFormat(title),
      );

    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, messages.required(title));
  },

  email: ({
    title,
    required = true,
  }: {
    title: string;
    required?: boolean;
  }) => {
    const base = z
      .string()
      .trim()
      .min(1, messages.empty(title))
      .toLowerCase()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, messages.invalidFormat(title));

    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, messages.required(title));
  },

  phoneNumber: ({
    title,
    required = true,
  }: {
    title: string;
    required?: boolean;
  }) => {
    const base = z
      .string()
      .trim()
      .min(1, messages.empty(title))
      .regex(/^\+[1-9]\d{7,14}$/, messages.phoneFormat(title));

    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, messages.required(title));
  },

  message: ({
    title,
    required = false,
    min = 10,
  }: {
    title: string;
    required?: boolean;
    min?: number;
  }) => {
    const base = z
      .string()
      .trim()
      .min(min, messages.minChar(title, min));

    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, messages.required(title));
  },

  country: ({
    title,
    required = true,
    min = 2,
  }: {
    title: string;
    required?: boolean;
    min?: number;
  }) => {
    const base = z
      .string()
      .trim()
      .min(1, messages.empty(title))
      .min(min, messages.minChar(title, min))
      .regex(/^\p{L}+(?:[\s'-]\p{L}+)*$/u, messages.invalidFormat(title));

    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, messages.required(title));
  },

  select: ({
    title,
    required = true,
  }: {
    title: string;
    required?: boolean;
  }) => {
    const base = z.string().trim().min(1, messages.select(title));

    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, messages.select(title));
  },

  date: ({ title, required = true }: { title: string; required?: boolean }) => {
    const base = z.string().trim().min(1, messages.empty(title));

    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, messages.required(title));
  },

  number: ({
    title,
    required = true,
    min = 0,
    max,
  }: {
    title: string;
    required?: boolean;
    min?: number;
    max?: number;
  }) => {
    const base = z
      .number(messages.empty(title))
      .min(min, messages.minVal(title, min))
      .refine((value) => (max !== undefined ? value <= max : true), {
        message: max !== undefined ? messages.maxVal(title, max) : undefined,
      });

    if (!required) {
      return base.optional();
    }
    return base;
  },
};

// ── 1. General Inquiry Schema ────────────────────────────────
export const generalInquirySchema = z.object({
  fullName: customValidator.fullName({ title: "Full Name" }),
  email: customValidator.email({ title: "Email Address" }),
  purpose: customValidator.select({ title: "Purpose of Inquiry" }),
  message: customValidator.message({ title: "Message" }),
});

export type GeneralInquiryValues = z.infer<typeof generalInquirySchema>;

// ── 2. Purchase Inquiry Schema ───────────────────────────────
export const purchaseInquirySchema = z.object({
  fullName: customValidator.fullName({ title: "Full Name" }),
  email: customValidator.email({ title: "Email Address" }),
  country: customValidator.country({ title: "Country" }),
  phone: customValidator.phoneNumber({ title: "Phone Number" }),
  message: customValidator.message({ title: "Message" }),
});

export type PurchaseInquiryValues = z.infer<typeof purchaseInquirySchema>;

// ── 3. Custom Artwork Inquiry Schema ─────────────────────────
export const customArtworkInquirySchema = z.object({
  fullName: customValidator.fullName({ title: "Full Name" }),
  email: customValidator.email({ title: "Email Address" }),
  country: customValidator.country({ title: "Country" }),
  phone: customValidator.phoneNumber({ title: "Phone Number" }),
  completionDate: customValidator.date({ title: "Preferred Completion Date" }),
  budget: customValidator.number({ title: "Budget", min: 1 }),
  height: customValidator.number({ title: "Height (cm)", min: 1, required: false }),
  width: customValidator.number({ title: "Width (cm)", min: 1, required: false }),
  description: customValidator.message({ title: "Description" }),
});

export type CustomArtworkInquiryValues = z.infer<
  typeof customArtworkInquirySchema
>;