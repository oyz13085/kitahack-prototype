import { Shield } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-12 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">MedScan</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            MedScan is an informational tool. Always consult your healthcare
            provider before changing medication.
          </p>
        </div>
      </div>
    </footer>
  );
}
