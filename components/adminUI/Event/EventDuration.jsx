"use client";

export default function EventDuration({
  form,
  handleChange,
  setForm,
  inputClass
}) {
  return (
    <div className="space-y-3">

      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        className={inputClass}
      />

      {!form.isFlexibleTime && (
        <div className="flex gap-2">
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className={inputClass}
          />
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
          className="
            w-4 h-4
            appearance-auto
            accent-[var(--Color-1)]
            bg-white
            !bg-white
            border
            border-[var(--Color-3)]
            rounded
            cursor-pointer
            "
        />
        Menyesuaikan
        
      </label>
      <p className="text-xs text-[var(--Color-1)]">
                      Centang jika waktu pelaksanaan lebih dari 1 waktu dan atau 1 hari
                    </p>
    </div>
  );
}