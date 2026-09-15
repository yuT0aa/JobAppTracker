"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [error, setError] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: true,
      callbackUrl: "/dashboard"
    });
    if (result?.error) setError("Invalid email or password.");
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-8">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to your CareerTrack workspace.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">Email<input name="email" type="email" required className="mt-2 h-10 w-full rounded-md border bg-background px-3" /></label>
        <label className="block text-sm font-medium">Password<input name="password" type="password" required className="mt-2 h-10 w-full rounded-md border bg-background px-3" /></label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </div>
  );
}
