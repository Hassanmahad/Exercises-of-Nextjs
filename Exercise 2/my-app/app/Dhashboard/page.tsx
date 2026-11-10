// app/dashboard/page.tsx
import { Suspense } from "react";
import { SlowComponent } from "./slowComponent";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
