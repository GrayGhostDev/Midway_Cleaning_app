"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PortalPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/portal/dashboard");
  }, [router]);

  return null;
}