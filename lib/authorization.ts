export type UserRole = "USER" | "ADMIN";

export function canAccessAdmin(role: UserRole | null | undefined) {
  return role === "ADMIN";
}
