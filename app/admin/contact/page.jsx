"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContactConfigForm from "../../../components/adminUI/ContactConfigForm";

export default function ContactMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("UNREAD");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("config"); // Default ke tab config

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ status: statusFilter, limit: "50" });
      const res = await fetch(`/api/contact/messages?${query}`);
      const json = await res.json();

      if (json?.success) {
        setMessages(json.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = async (message) => {
    try {
      const res = await fetch(`/api/contact/messages/${message.id}`);
      const json = await res.json();

      if (json?.success) {
        setSelectedMessage(json.data.message);
        setReplyText(json.data.message.reply || "");
      }
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      alert("Pesan reply tidak boleh kosong");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/contact/messages/${selectedMessage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      });

      const json = await res.json();

      if (json?.success) {
        setSelectedMessage(json.data.message);
        alert("Reply berhasil disimpan");
        fetchMessages();
      } else {
        alert("Gagal menyimpan reply");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return;

    try {
      const res = await fetch(`/api/contact/messages/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (json?.success) {
        setSelectedMessage(null);
        fetchMessages();
        alert("Pesan berhasil dihapus");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Gagal menghapus pesan");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200">
        <button
          onClick={() => setActiveTab("config")}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "config"
              ? "border-[#E93C8E] text-[#E93C8E]"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          ⚙️ Konfigurasi Kontak
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "messages"
              ? "border-[#E93C8E] text-[#E93C8E]"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          📬 Pesan Masuk
        </button>
      </div>

      {/* Config Tab */}
      {activeTab === "config" && <ContactConfigForm />}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Pesan Masuk</h2>

              {/* Filter */}
              <div className="space-y-2">
                {["UNREAD", "READ", "REPLIED", "ARCHIVED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-[#E93C8E] text-white"
                        : "bg-gray-100 text-zinc-900 hover:bg-gray-200"
                    }`}
                  >
                    {status === "UNREAD" && `📬 Belum Dibaca`}
                    {status === "READ" && `📖 Sudah Dibaca`}
                    {status === "REPLIED" && `✉️ Sudah Dibalas`}
                    {status === "ARCHIVED" && `📦 Arsip`}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-[70vh] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-zinc-600">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="p-6 text-center text-zinc-600">Tidak ada pesan</div>
              ) : (
                <div className="divide-y">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-left p-4 border-l-4 transition-colors ${
                        selectedMessage?.id === msg.id
                          ? "bg-blue-50 border-l-[#E93C8E]"
                          : "border-l-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-semibold text-zinc-900 text-sm">{msg.name}</div>
                      <div className="text-xs text-zinc-600">{msg.email}</div>
                      <div className="text-xs text-zinc-500 mt-1 truncate">{msg.subject}</div>
                      <div className="text-xs text-zinc-400 mt-2">
                        {new Date(msg.createdAt).toLocaleDateString("id-ID")}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            {!selectedMessage ? (
              <div className="h-96 flex items-center justify-center text-center">
                <div className="text-zinc-400">
                  <p className="text-lg font-medium">Pilih pesan untuk melihat detail</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="border-b pb-4">
                  <h3 className="text-xl font-bold text-zinc-900">{selectedMessage.subject}</h3>
                  <div className="mt-2 space-y-1 text-sm text-zinc-600">
                    <p>
                      <strong>Dari:</strong> {selectedMessage.name} ({selectedMessage.email})
                    </p>
                    <p>
                      <strong>Tanggal:</strong>{" "}
                      {new Date(selectedMessage.createdAt).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          selectedMessage.status === "UNREAD"
                            ? "bg-red-100 text-red-800"
                            : selectedMessage.status === "READ"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedMessage.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-zinc-900 mb-2">Pesan:</h4>
                  <p className="text-sm text-zinc-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Reply Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-900">Balas Pesan:</h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm focus:border-[#E93C8E] focus:outline-none focus:ring-2 focus:ring-[#E93C8E]/20"
                    placeholder="Tuliskan balasan Anda di sini..."
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitReply}
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-[#E93C8E] text-white px-4 py-2 text-sm font-medium hover:bg-[#d63380] disabled:opacity-50 transition-colors"
                    >
                      {submitting ? "Menyimpan..." : "Simpan Balasan"}
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
