import { Skeleton } from "@heroui/react";
export default function Loader() {
  return (
    <>
      <div className="shadow-panel mx-auto w-1/2 rounded-2xl border  my-4 border-lightPink bg-white/80 p-5">
        <Skeleton className="h-32 rounded-lg bg-gray-100 mb-5" />
        <div className="space-y-3 ">
          <Skeleton className="h-3 w-3/5 rounded-lg bg-gray-100" />
          <Skeleton className="h-3 w-4/5 rounded-lg bg-gray-100" />
          <Skeleton className="h-3 w-2/5 rounded-lg bg-gray-100" />
        </div>
      </div>
    </>
  );
}
