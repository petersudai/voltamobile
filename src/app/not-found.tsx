import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center text-center px-4">
      <Logo size="lg" variant="auto" className="mb-8" />
      <p className="text-8xl font-black text-ink mb-4">404</p>
      <h1 className="text-2xl font-bold text-ink-2 mb-3">Page not found</h1>
      <p className="text-ink-3 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
