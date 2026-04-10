import { Loader } from "@/components/ui/Loader";

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center bg-linear-to-br from-slate-100 via-indigo-50 to-cyan-50">
      <Loader label="Loading…" />
    </div>
  );
}
