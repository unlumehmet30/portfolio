import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-xl items-center px-4 py-16 sm:px-6">
      <AdminLoginForm />
    </div>
  );
}
