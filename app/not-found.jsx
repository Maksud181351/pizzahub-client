import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PizzaArt } from "@/components/site/pizza-art";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Page not found" };
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <PizzaArt animate={false} className="size-40 opacity-90" />
        <h1 className="section-title mt-4">404: this slice is missing</h1>
        <p className="mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-6 flex gap-3">
          <Button asChild><Link href="/">Go home</Link></Button>
          <Button asChild variant="outline"><Link href="/menu">Browse menu</Link></Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
