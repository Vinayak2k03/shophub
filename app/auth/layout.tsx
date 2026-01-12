import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect authenticated users away from auth pages
  if (session?.user) {
    redirect("/");
  }

  return <>{children}</>;
}
