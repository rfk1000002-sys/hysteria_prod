"use client";

/**
 * TablePlatformColom.js
 *
 * Kolom DataTable untuk menampilkan data Event (dari model Event via API).
 * Digunakan di halaman admin platform: ditampart, artlab, dan laki-masak
 * pada bagian tabel event (bawah halaman).
 *
 * Row shape (dari API /api/admin/platform-content/[platform]/events):
 *   id, title, poster, categories [{id, title, slug, isPrimary}],
 *   startAt, endAt, status (UPCOMING|ONGOING|FINISHED), isPublished, ...
 */

import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { StatusBadge } from "./data.jsx";

// Map status internal → label bahasa Indonesia (sama dengan StatusBadge di data.js)
const STATUS_LABEL = {
  UPCOMING: "Akan Datang",
  ONGOING: "Sedang Berlangsung",
  FINISHED: "Berakhir",
};

/**
 * Bangun kolom DataTable untuk tabel event platform.
 *
 * @param {{ onEdit: (row: object) => void, onDelete: (row: object) => void }} callbacks
 * @returns {import("@/components/ui/DataTable").Column[]}
 */
export function buildEventColumns({ onEdit, onDelete, preferredCategorySlugs } = {}) {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 60,
      freeze: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poster",
      headerName: "Thumbnail",
      width: 90,
      align: "center",
      headerAlign: "center",
      render: (row) =>
        row.poster ? (
          <div className="flex items-center justify-center">
            <Image
              src={row.poster}
              alt={row.title ?? "poster"}
              width={56}
              height={40}
              className="rounded object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-14 h-10 bg-zinc-200 rounded flex items-center justify-center text-xs text-zinc-500">
            No img
          </div>
        ),
    },
    {
      field: "title",
      headerName: "Judul",
      width: 240,
      render: (row) => (
        <span className="font-medium text-zinc-800 line-clamp-2">
          {row.title ?? "-"}
        </span>
      ),
    },
    {
      field: "categories",
      headerName: "Sub Kategori",
      width: 180,
      render: (row) => {
        const cats = row.categories ?? [];
        const preferred =
          preferredCategorySlugs?.length
            ? cats.find((c) => preferredCategorySlugs.includes(c.slug))
            : undefined;
        const display =
          preferred ??
          cats.find((c) => c.isPrimary) ??
          cats[0];
        return (
          <span className="text-zinc-700 text-sm">{display?.title ?? "-"}</span>
        );
      },
    },
    {
      field: "startAt",
      headerName: "Tanggal",
      width: 130,
      align: "center",
      headerAlign: "center",
      render: (row) => {
        if (!row.startAt) return "-";
        const d = new Date(row.startAt);
        return (
          <span className="text-zinc-700 text-sm">
            {d.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      align: "center",
      headerAlign: "center",
      render: (row) => (
        <StatusBadge status={STATUS_LABEL[row.status] ?? row.status} />
      ),
    },
    {
      field: "action",
      headerName: "Aksi",
      width: 90,
      align: "center",
      headerAlign: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(row);
              }}
              className="text-blue-600 hover:bg-blue-50"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(row);
              }}
              className="text-red-500 hover:bg-red-50"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];
}