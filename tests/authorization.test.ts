import { describe, expect, it } from "vitest";
import { canAccessAdmin } from "@/lib/authorization";

describe("admin authorization", () => {
  it("allows only the administrator role", () => {
    expect(canAccessAdmin("ADMIN")).toBe(true);
    expect(canAccessAdmin("USER")).toBe(false);
    expect(canAccessAdmin(undefined)).toBe(false);
  });
});
