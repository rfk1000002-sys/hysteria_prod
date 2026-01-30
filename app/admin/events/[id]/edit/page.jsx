"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EventForm from "../../../../../components/adminUI/Event/EventForm";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/admin/events/${id}`);
        if (!res.ok) throw new Error("Gagal fetch event");
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
        router.push("/admin/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, router]);

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (!initialData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-black">Edit Event</h1>
      <EventForm initialData={initialData} isEdit={true} eventId={id} />
    </div>
  );
}
