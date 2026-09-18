import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { hasAdminSession } from "@/lib/admin-session";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");
  return <section className="section"><div className="container" style={{ maxWidth: 620 }}><AdminLoginForm configured={Boolean(process.env.ADMIN_PREVIEW_TOKEN)} /></div></section>;
}
