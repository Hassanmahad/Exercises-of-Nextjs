
"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
    >
      Logout
    </button>
  );
}
