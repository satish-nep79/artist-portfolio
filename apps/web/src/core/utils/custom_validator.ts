import { z } from "zod";

const emptyMsg = (title: string) => `Please Enter ${title}`;

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
      .min(1, emptyMsg(title))
      .min(min, `${title} must be at least ${min} characters`);
    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, `Please Enter ${title}`);
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
      .min(1, emptyMsg(title))
      .min(min, `${title} must be at least ${min} characters`)
      .regex(/^[a-zA-Z\s]+$/, `${title} must contain only letters and spaces`);
    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, `Please Enter ${title}`);
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
      .min(min, `${title} must be at least ${min} characters`)
      .regex(
        /^\p{L}+(?:['-]\p{L}+)*(?:\s+\p{L}+(?:['-]\p{L}+)*)+$/u,
        `Enter a valid ${title}`,
      );
    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, `Please Enter ${title}`);
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
      .min(1, emptyMsg(title))
      .toLowerCase()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, `Enter a valid ${title}`);
    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, `Please Enter ${title}`);
  },

  // Strict E.164 format: '+' + country code + digits, no spaces/dashes.
  // e.g. +358401234567
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
      .min(1, emptyMsg(title))
      .regex(
        /^\+[1-9]\d{7,14}$/,
        `${title} must include a country code, digits only (e.g. +358401234567)`,
      );
    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, `Please Enter ${title}`);
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
      .min(min, `${title} must be at least ${min} characters`);
    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, `Please Enter ${title}`);
  },

  // Unicode-aware, allows spaces/hyphens/apostrophes: "Côte d'Ivoire", "Guinea-Bissau"
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
      .min(1, emptyMsg(title))
      .min(min, `${title} must be at least ${min} characters`)
      .regex(/^\p{L}+(?:[\s'-]\p{L}+)*$/u, `Enter a valid ${title}`);
    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, `Please Enter ${title}`);
  },

  // Dropdown / select fields, e.g. "Purpose of Inquiry".
  // The <select> element itself already constrains the value to a valid
  // option, so this just checks something was picked.
  select: ({
    title,
    required = true,
  }: {
    title: string;
    required?: boolean;
  }) => {
    const base = z.string().trim().min(1, `Please select a ${title}`);
    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, `Please select a ${title}`);
  },

  // Date fields, e.g. "Preferred Completion Date". Expects a yyyy-mm-dd
  // string (the native value of an <input type="date">), which the browser
  // already guarantees is well-formed — this just checks it's not empty.
  date: ({ title, required = true }: { title: string; required?: boolean }) => {
    const base = z.string().trim().min(1, emptyMsg(title));
    if (!required) {
      return base.optional().or(z.literal(""));
    }
    return base.min(1, `Please Enter ${title}`);
  },

  // Numeric fields, e.g. "Budget", "Height (cm)", "Width (cm)"
  number: ({
    title,
    required = true,
    min = 0,
  }: {
    title: string;
    required?: boolean;
    min?: number;
  }) => {
    const base = z.coerce
      .number({ message: `${title} must be a number` })
      .min(min, `${title} must be at least ${min}`);
    if (!required) {
      return base.optional();
    }
    return base;
  },
};

// ── 1. "Let's Start a Conversation" — general inquiry ───────
export const generalInquirySchema = z.object({
  fullName: customValidator.fullName({ title: "Full Name" }),
  email: customValidator.email({ title: "Email Address" }),
  purpose: customValidator.select({ title: "Purpose of Inquiry" }),
  message: customValidator.message({ title: "Message" }), // optional
});

export type GeneralInquiryValues = z.infer<typeof generalInquirySchema>;

// ── 2. "Purchase Inquiry" ────────────────────────────────────
export const purchaseInquirySchema = z.object({
  fullName: customValidator.fullName({ title: "Full Name" }),
  email: customValidator.email({ title: "Email Address" }),
  country: customValidator.country({ title: "Country" }),
  phone: customValidator.phoneNumber({ title: "Phone Number" }),
  message: customValidator.message({ title: "Message" }), // optional
});

export type PurchaseInquiryValues = z.infer<typeof purchaseInquirySchema>;

// ── 3. "Custom Artwork Inquiry" ──────────────────────────────
export const customArtworkInquirySchema = z.object({
  fullName: customValidator.fullName({ title: "Full Name" }),
  email: customValidator.email({ title: "Email Address" }),
  country: customValidator.country({ title: "Country" }),
  phone: customValidator.phoneNumber({ title: "Phone Number" }),
  completionDate: customValidator.date({ title: "Preferred Completion Date" }),
  budget: customValidator.number({ title: "Budget", min: 1 }),
  height: customValidator.number({ title: "Height (cm)", min: 1 }),
  width: customValidator.number({ title: "Width (cm)", min: 1 }),
  description: customValidator.message({ title: "Description" }), // optional
});

export type CustomArtworkInquiryValues = z.infer<
  typeof customArtworkInquirySchema
>;
