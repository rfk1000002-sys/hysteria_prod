"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../../../lib/context/auth-context";
import Card from "../../../../components/ui/Card";
import Toast from "../../../../components/ui/Toast";
import Button from "@mui/material/Button";

function defaultCard(index, platformId = "") {
  return {
    platformId,
    titleOverride: "",
    imageUrlOverride: "",
    linkUrl: "",
    slotType: index < 3 ? "tall" : "short",
    order: index,
    isActive: true,
  };
}

function normalizePlatformCards(cards, platformOptions) {
  const incoming = Array.isArray(cards) ? cards : [];

  const normalized = incoming
    .map((card, index) => ({
      platformId: card?.platformId || "",
      titleOverride: card?.titleOverride || "",
      imageUrlOverride: card?.imageUrlOverride || "",
      linkUrl: card?.linkUrl || "",
      slotType: card?.slotType === "short" ? "short" : "tall",
      order: Number.isInteger(card?.order) ? card.order : index,
      isActive: card?.isActive !== false,
    }))
    .sort((a, b) => a.order - b.order);

  const fallbackPlatformIds = (platformOptions || []).map((item) => item.id);
  while (normalized.length < 5) {
    const index = normalized.length;
    const unused = fallbackPlatformIds.find((id) => !normalized.some((card) => Number(card.platformId) === Number(id)));
    normalized.push(defaultCard(index, unused || ""));
  }

  return normalized.slice(0, 5).map((card, index) => ({
    ...card,
    order: Number.isInteger(card.order) ? card.order : index,
    slotType: card.slotType === "short" ? "short" : "tall",
    isActive: true,
  }));
}

export default function PlatformKami() {
  const { apiCall, csrfToken } = useAuth();

  const [platformCards, setPlatformCards] = useState(() => Array.from({ length: 5 }, (_, index) => defaultCard(index)));
  const [platformOptions, setPlatformOptions] = useState([]);
  const [platformLoading, setPlatformLoading] = useState(true);
  const [platformSaving, setPlatformSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "error" });

  const fetchPlatformSettings = useCallback(async () => {
    setPlatformLoading(true);
    try {
      const res = await apiCall("/api/admin/homepage-platform", { method: "GET" });
      const json = await res.json().catch(() => null);
      if (!json?.success) {
        throw new Error(json?.error?.message || "Gagal memuat pengaturan Platform Kami");
      }

      const options = Array.isArray(json?.data?.platformOptions) ? json.data.platformOptions : [];
      const cards = Array.isArray(json?.data?.cards) ? json.data.cards : [];

      setPlatformOptions(options);
      setPlatformCards(normalizePlatformCards(cards, options));
    } catch (error) {
      console.error("Error fetching homepage platform settings:", error);
      setToast({ visible: true, message: error?.message || "Gagal memuat pengaturan Platform Kami", type: "error" });
    } finally {
      setPlatformLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchPlatformSettings();
  }, [fetchPlatformSettings]);

  const slotSummary = useMemo(() => {
    const tallCount = platformCards.filter((card) => card.slotType === "tall").length;
    const shortCount = platformCards.filter((card) => card.slotType === "short").length;
    return { tallCount, shortCount };
  }, [platformCards]);

  const handlePlatformCardChange = (index, field, value) => {
    setPlatformCards((prev) =>
      prev.map((card, cardIndex) => {
        if (cardIndex !== index) return card;

        if (field === "platformId") {
          return { ...card, platformId: value ? Number(value) : "" };
        }

        if (field === "order") {
          return { ...card, order: Number(value) };
        }

        if (field === "slotType") {
          return { ...card, slotType: value === "short" ? "short" : "tall" };
        }

        if (field === "file") {
          return { ...card, file: value, imageUrlOverride: card.imageUrlOverride || "" };
        }

        return { ...card, [field]: value };
      }),
    );
  };

  const dragSrcIndex = useRef(null);

  const onDragStart = (e, index) => {
    dragSrcIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e, targetIndex) => {
    e.preventDefault();
    const src = dragSrcIndex.current;
    if (src === null || src === undefined) return;

    setPlatformCards((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(src, 1);
      copy.splice(targetIndex, 0, moved);
      return copy.map((card, idx) => ({ ...card, order: idx }));
    });

    dragSrcIndex.current = null;
  };

  const validatePlatformCards = () => {
    if (!Array.isArray(platformCards) || platformCards.length !== 5) {
      return "Jumlah kartu harus tepat 5";
    }

    const missingPlatform = platformCards.some((card) => !card.platformId);
    if (missingPlatform) {
      return "Semua kartu harus memilih platform";
    }

    const platformIds = platformCards.map((card) => Number(card.platformId));
    if (new Set(platformIds).size !== platformIds.length) {
      return "Platform tidak boleh duplikat";
    }

    const tallCount = platformCards.filter((card) => card.slotType === "tall").length;
    const shortCount = platformCards.filter((card) => card.slotType === "short").length;
    if (tallCount !== 3 || shortCount !== 2) {
      return "Komposisi slot harus 3 Tall dan 2 Short";
    }

    const orderValues = platformCards.map((card) => Number(card.order));
    if (new Set(orderValues).size !== orderValues.length) {
      return "Order tidak boleh duplikat";
    }

    return null;
  };

  const handleSavePlatformCards = async () => {
    const validationError = validatePlatformCards();
    if (validationError) {
      setToast({ visible: true, message: validationError, type: "error" });
      return;
    }

    setPlatformSaving(true);
    try {
      const payloadCards = platformCards.map((card) => ({
        platformId: Number(card.platformId),
        titleOverride: card.titleOverride || null,
        imageUrlOverride: card.imageUrlOverride || null,
        linkUrl: card.linkUrl || null,
        slotType: card.slotType,
        order: Number(card.order),
        isActive: true,
      }));

      const hasFiles = platformCards.some((card) => card && card.file);
      let res;
      if (hasFiles) {
        const fd = new FormData();
        fd.append("cards", JSON.stringify(payloadCards.map((card) => ({ ...card, imageUrlOverride: card.imageUrlOverride || null }))));
        platformCards.forEach((card, idx) => {
          if (card && card.file) {
            fd.append(`image_${idx}`, card.file);
          }
        });

        res = await fetch("/api/admin/homepage-platform", {
          method: "PUT",
          body: fd,
          credentials: "include",
          headers: { "x-csrf-token": csrfToken || "" },
        });
      } else {
        res = await apiCall("/api/admin/homepage-platform", {
          method: "PUT",
          body: JSON.stringify({ cards: payloadCards }),
        });
      }

      const json = await res.json().catch(() => null);
      if (!json?.success) {
        throw new Error(json?.error?.message || "Gagal menyimpan pengaturan Platform Kami");
      }

      const nextCards = Array.isArray(json?.data?.cards) ? json.data.cards : payloadCards;
      setPlatformCards(normalizePlatformCards(nextCards, platformOptions));
      setToast({ visible: true, message: "Pengaturan Platform Kami berhasil disimpan", type: "success" });
    } catch (error) {
      setToast({ visible: true, message: error?.message || "Gagal menyimpan pengaturan Platform Kami", type: "error" });
    } finally {
      setPlatformSaving(false);
    }
  };

  return (
    <Card>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Platform Kami Management</h2>
          <p className="mt-1 text-sm text-zinc-500">Atur 5 kartu platform pada homepage.</p>
          <div className="mt-3 space-y-1 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700">
            <p>Sizing info:</p>
            <p>Tall: dipakai untuk 3 kartu baris pertama (rasio sekitar 66.66%).</p>
            <p>Short: dipakai untuk 2 kartu baris kedua (rasio sekitar 40%).</p>
            <p>Komposisi wajib: 3 Tall + 2 Short.</p>
          </div>
        </div>

        <div className="text-sm text-zinc-700">
          <span className="font-medium">Slot Summary:</span> Tall {slotSummary.tallCount} / Short {slotSummary.shortCount}
        </div>

        {platformLoading ? (
          <p className="text-sm text-zinc-500">Loading platform settings...</p>
        ) : (
          <div className="space-y-4">
            {platformCards.map((card, index) => (
              <div
                key={`platform-card-${index}`}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, index)}
                className="space-y-3 rounded-md border border-zinc-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-800">Card #{index + 1}</h3>
                  <span className="text-xs text-zinc-500">Slot hint: {index < 3 ? "Tall row" : "Short row"}</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="space-y-1 text-xs text-zinc-700">
                    <span className="block">Platform</span>
                    <select
                      className="w-full rounded border border-zinc-300 px-2 py-2 text-sm"
                      value={card.platformId}
                      onChange={(e) => handlePlatformCardChange(index, "platformId", e.target.value)}>
                      <option value="">Pilih platform</option>
                      {platformOptions.map((option) => (
                        <option
                          key={option.id}
                          value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1 text-xs text-zinc-700">
                    <span className="block">Slot Type</span>
                    <select
                      className="w-full rounded border border-zinc-300 px-2 py-2 text-sm"
                      value={card.slotType}
                      onChange={(e) => handlePlatformCardChange(index, "slotType", e.target.value)}>
                      <option value="tall">Tall</option>
                      <option value="short">Short</option>
                    </select>
                  </label>

                  <label className="space-y-1 text-xs text-zinc-700">
                    <span className="block">Order</span>
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded border border-zinc-300 px-2 py-2 text-sm"
                      value={card.order}
                      onChange={(e) => handlePlatformCardChange(index, "order", e.target.value)}
                    />
                  </label>

                  <label className="space-y-1 text-xs text-zinc-700 sm:col-span-2 lg:col-span-1">
                    <span className="block">Title Override (opsional)</span>
                    <input
                      type="text"
                      className="w-full rounded border border-zinc-300 px-2 py-2 text-sm"
                      value={card.titleOverride}
                      onChange={(e) => handlePlatformCardChange(index, "titleOverride", e.target.value)}
                      placeholder="Kosongkan untuk title platform"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-zinc-700 sm:col-span-2 lg:col-span-1">
                    <span className="block">Image URL Override (opsional)</span>
                    <input
                      type="text"
                      className="mb-2 w-full rounded border border-zinc-300 px-2 py-2 text-sm"
                      value={card.imageUrlOverride}
                      onChange={(e) => handlePlatformCardChange(index, "imageUrlOverride", e.target.value)}
                      placeholder="https://..."
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePlatformCardChange(index, "file", e.target.files && e.target.files[0])}
                      />
                      {card.file ? (
                        <img
                          src={card.file && typeof card.file === "object" ? URL.createObjectURL(card.file) : card.imageUrlOverride}
                          alt="preview"
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : card.imageUrlOverride ? (
                        <img
                          src={card.imageUrlOverride}
                          alt="preview"
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : null}
                    </div>
                  </label>

                  <label className="space-y-1 text-xs text-zinc-700 sm:col-span-2 lg:col-span-1">
                    <span className="block">Destination Link (opsional)</span>
                    <input
                      type="text"
                      className="w-full rounded border border-zinc-300 px-2 py-2 text-sm"
                      value={card.linkUrl}
                      onChange={(e) => handlePlatformCardChange(index, "linkUrl", e.target.value)}
                      placeholder="/platform/hysteria-artlab atau https://..."
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            variant="contained"
            color="primary"
            disabled={platformSaving || platformLoading}
            onClick={handleSavePlatformCards}>
            {platformSaving ? "Saving..." : "Save Platform Kami"}
          </Button>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((current) => ({ ...current, visible: false }))}
      />
    </Card>
  );
}
