import { Suspense } from "react";
import { BrowseMenu } from "./browse-menu";

export const metadata = { title: "Browse Menu" };
export default function MenuPage() {
  return (
    <Suspense>
      <BrowseMenu />
    </Suspense>
  );
}
