import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
          <Icon size={20} />
        </div>
      </div>

      <h2 className="mt-4 text-2xl font-bold text-slate-800">{value}</h2>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

export default StatCard;
