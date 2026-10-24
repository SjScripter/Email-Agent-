import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const COOKIE_NAME = "school_outreach_session";

async function DashboardWrapper() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const password = process.env.APP_PASSWORD;
  if (!password || token !== Buffer.from(password).toString("base64")) {
    redirect("/login");
  }
  const Dashboard = (await import("./dashboard/page")).default;
  return <Dashboard />;
}

export default function RootPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DashboardWrapper />
    </Suspense>
  );
}
