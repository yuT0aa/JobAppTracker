import { describe, expect, it } from "vitest";
import { applicationInputSchema, companyInputSchema } from "@/lib/validation";

describe("application validation", () => {
  it("accepts a valid application and defaults its status", () => {
    const result = applicationInputSchema.parse({ company: "Acme", role: "Engineer" });
    expect(result).toMatchObject({ company: "Acme", role: "Engineer", status: "SAVED" });
  });

  it("rejects missing company and role", () => {
    const result = applicationInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects malformed company URLs", () => {
    const result = companyInputSchema.safeParse({ name: "Acme", website: "not-a-url" });
    expect(result.success).toBe(false);
  });
});
