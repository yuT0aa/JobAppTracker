import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/login",
  "/dashboard",
  "/applications",
  "/companies",
  "/calendar",
  "/tasks",
  "/contacts",
  "/documents",
  "/analytics",
  "/notifications",
  "/admin"
];

for (const route of routes) {
  test(`${route} responds without a server error`, async ({ request }) => {
    const response = await request.get(route);
    expect(response?.status()).toBeLessThan(500);
    expect(await response.text()).not.toContain("Internal Server Error");
  });
}

test("public health endpoint reports readiness", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toMatchObject({ status: "ok" });
});

test("protected API rejects unauthenticated access", async ({ request }) => {
  const response = await request.get("/api/applications");
  expect(response.status()).toBe(401);
});
