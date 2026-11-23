"use client";

import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const currentTime = new Date().toLocaleTimeString();
    setTime(currentTime);
  }, []);

  return (
    <p className="text-sm text-gray-500 mb-4">
      Last updated: {time || "Loading..."}
    </p>
  );
}