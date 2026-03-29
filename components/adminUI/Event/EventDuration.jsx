"use client";
import { Calendar, Clock } from "lucide-react";

export default function EventDuration({
  form,
  handleChange,
  setForm,
  inputClass
}) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className={`${inputClass} pr-9`}
        />
        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Color-5)] pointer-events-none"/>
      </div>

      <div className="relative">
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className={`${inputClass} pr-9`}
        />
        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Color-5)] pointer-events-none"/>
      </div>
      

      {!form.isFlexibleTime && (
        <div className="flex gap-2">
          <div className="relative w-full">
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className={`${inputClass} pr-9`}
            />
            <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Color-5)] pointer-events-none"/>
          </div>

          <div className="relative w-full">
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className={`${inputClass} pr-9`}
            />
            <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Color-5)] pointer-events-none"/>
          </div>
        </div>
      )}

      <label className="flex gap-2">
        <input
          type="checkbox"
          checked={form.isFlexibleTime}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              isFlexibleTime: e.target.checked,
            }))
          }
          className="w-4 h-4 appearance-auto accent-[var(--Color-1)] bg-white !bg-white border border-[var(--Color-3)] rounded cursor-pointer"
        />
        Menyesuaikan  
      </label>
      {!form.isFlexibleTime ? (
        <p className="text-xs text-[var(--Color-1)]">
          Centang jika acara berlangsung lebih dari satu sesi atau waktunya tidak pasti.
        </p>
      ) : (
        <p className="text-xs text-[var(--Color-1)] italic">
          Waktu acara akan ditampilkan sebagai fleksibel kepada peserta.
        </p>
      )}
    </div>
  );
}