import { Suspense } from "react";
import HomeContent from "@/app/components/HomeContent";

export default function Home() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
