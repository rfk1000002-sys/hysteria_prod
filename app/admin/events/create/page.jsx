import { colors } from "@mui/material";
import EventForm from "../../../../components/adminUI/Event/EventForm";

export default function CreateEventPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-6">
        Tambah Event
      </h1>

      <EventForm />
    </div>
  );
}
