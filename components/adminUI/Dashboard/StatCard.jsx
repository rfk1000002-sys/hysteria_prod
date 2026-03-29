"use client";

export default function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl border border-black shadow-sm p-5">
      <p className="text-3xl font-bold text-pink-500">
        {value ?? 0}
      </p>
      <p className="text-sm text-zinc-500 mt-1">{title}</p>
    </div>
  );
}