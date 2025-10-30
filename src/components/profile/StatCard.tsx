import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  className?: string;
}

export function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
  return (
    <Card className={cn("flex flex-col items-center justify-center p-4 text-center group", className)}>
      <Icon className="h-8 w-8 text-green-500 mb-2 transition-all duration-150 ease-in-out group-hover:text-green-400 group-hover:drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]" />
      <p className="text-2xl font-bold text-black mb-1">{value}</p>
      <p className="text-sm text-gray-700 font-medium">{label}</p>
    </Card>
  );
}
