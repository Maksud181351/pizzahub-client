"use client";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#c62d1f", "#f08a24", "#2f5d3a", "#8a6a4f", "#e9c46a"];

export function PageHeader({ title, text, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-extrabold">{title}</h1>
        {text && <p className="mt-1 text-sm text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-tomato/10 text-tomato">{Icon && <Icon className="size-5" />}</span>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <p className="font-display text-2xl font-extrabold capitalize">{value}</p>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
    </Card>
  );
}

export function StatGrid({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

const tick = { fill: "var(--muted)", fontSize: 12 };
const tip = { contentStyle: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, color: "var(--ink)" } };

export function BarCard({ title, data, prefix = "" }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
            <XAxis dataKey="name" tick={tick} tickLine={false} axisLine={false} />
            <YAxis tick={tick} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip {...tip} formatter={(v) => `${prefix}${v}`} cursor={{ fill: "var(--surface-2)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PieCard({ title, data }) {
  const empty = data.every((d) => !d.value);
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="h-64">
        {empty ? (
          <p className="flex h-full items-center justify-center text-sm text-muted">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2} stroke="var(--surface)">
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
