import EventTable from "../../../components/adminUI/Event/EventTable";

export default function EventDashboardPage() {
  const events = [
    {
      title: "Kembali ke Semula – 10 Years",
      date: "12 Feb 2026",
      time: "19:00",
      location: "Semarang",
      status: "Upcoming",
      poster: "/dummy/poster1.jpg",
    },
    {
      title: "Diskusi Buku",
      date: "5 Jan 2026",
      time: "15:00",
      location: "Rumah Po Han",
      status: "Finished",
      poster: "",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">
          Daftar Event
        </h1>

        <a
          href="/admin/events/create"
          className="px-4 py-2 bg-pink-600 text-white rounded-lg"
        >
          + Tambah Event
        </a>
      </div>

      <EventTable events={events} />
    </div>
  );
}
