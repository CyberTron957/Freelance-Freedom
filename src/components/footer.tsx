import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} FreelanceFreedom. Built for hackathon demonstration.
        </p>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="underline underline-offset-4 hover:text-foreground">
            Home
          </Link>
          <Link href="/jobs/browse" className="underline underline-offset-4 hover:text-foreground">
            Browse Jobs
          </Link>
          <Link href="/jobs/create" className="underline underline-offset-4 hover:text-foreground">
            Post Job
          </Link>
        </nav>
      </div>
    </footer>
  );
} 