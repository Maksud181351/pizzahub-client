"use client";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="section-title">Something burned in the oven</h1>
      <p className="mt-2 text-muted">{error?.message ? "An unexpected error occurred." : "Please try again."} If it keeps happening, come back in a few minutes.</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => (location.href = "/")}>Go home</Button>
      </div>
    </main>
  );
}
