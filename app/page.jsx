import { redirect } from "next/navigation";

export default function Home() {
  // Otomatis mengarahkan pengunjung dari domain.com ke domain.com/dashboard
  redirect("/dashboard");
}
