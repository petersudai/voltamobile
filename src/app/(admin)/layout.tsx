import { SessionProviderWrapper } from "@/components/admin/SessionProviderWrapper";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}
