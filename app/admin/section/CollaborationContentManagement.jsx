'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../lib/context/auth-context';
import Card from '../../../components/ui/Card';
import Toast from '../../../components/ui/Toast';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function CollaborationContentManagement() {
  const { apiCall } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedContent, setSelectedContent] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    heroTitle: '',
    heroDescription: '',
    googleFormUrl: '',
    ctaDescription: '',
    whyBenefits: [{ title: '', description: '', imageUrl: '' }],
    schemes: [{ title: '', description: '', imageUrl: '' }],
    flowSteps: [{ step: '1', title: '', description: '', imageUrl: '' }],
    isActive: false,
  });

  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiCall('/api/admin/collaboration-content', { method: 'GET' });
      const json = await res.json();

      if (json?.success) {
        setContents(json.data.contents || []);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      showToast('Gagal mengambil data konten', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  // Handle file upload untuk gambar
  const handleImageUpload = async (file, section, index) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar (JPG, PNG, GIF, WebP, SVG, dll)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file gambar tidak boleh melebihi 5MB', 'error');
      return;
    }

    try {
      // Upload file ke server
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const res = await apiCall('/api/admin/collaboration-content/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const json = await res.json();

      if (json?.success) {
        // Update formData dengan image path yang di-return dari API
        const imagePath = json.data.imagePath;
        if (section === 'whyBenefits') {
          const updated = [...formData.whyBenefits];
          updated[index] = { ...updated[index], imageUrl: imagePath };
          setFormData({ ...formData, whyBenefits: updated });
        } else if (section === 'schemes') {
          const updated = [...formData.schemes];
          updated[index] = { ...updated[index], imageUrl: imagePath };
          setFormData({ ...formData, schemes: updated });
        } else if (section === 'flowSteps') {
          const updated = [...formData.flowSteps];
          updated[index] = { ...updated[index], imageUrl: imagePath };
          setFormData({ ...formData, flowSteps: updated });
        }
        showToast('Gambar berhasil di-upload', 'success');
      } else {
        showToast(json?.message || 'Gagal upload gambar', 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Gagal upload gambar: ' + error.message, 'error');
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedContent(null);
    setFormData({
      heroTitle: '',
      heroDescription: '',
      googleFormUrl: '',
      ctaDescription: '',
      whyBenefits: [{ title: '', description: '', imageUrl: '' }],
      schemes: [{ title: '', description: '', imageUrl: '' }],
      flowSteps: [{ step: '1', title: '', description: '', imageUrl: '' }],
      isActive: false,
    });
    setShowModal(true);
  };

  const handleEdit = (content) => {
    setModalMode('edit');
    setSelectedContent(content);
    setFormData(content);
    setShowModal(true);
  };

  const handleView = (content) => {
    setModalMode('view');
    setSelectedContent(content);
    setFormData(content);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        modalMode === 'create'
          ? '/api/admin/collaboration-content'
          : `/api/admin/collaboration-content/${selectedContent.id}`;

      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await apiCall(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json?.success) {
        showToast(
          modalMode === 'create' ? 'Konten berhasil dibuat' : 'Konten berhasil diupdate',
          'success'
        );
        setShowModal(false);
        fetchContents();
      } else {
        const apiMessage = json?.error?.message || json?.message;
        throw new Error(apiMessage || 'Gagal menyimpan konten');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showToast(error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus konten ini?')) return;

    try {
      const res = await apiCall(`/api/admin/collaboration-content/${id}`, {
        method: 'DELETE',
      });

      const json = await res.json();

      if (json?.success) {
        showToast('Konten berhasil dihapus', 'success');
        fetchContents();
      } else {
        throw new Error(json?.message || 'Gagal menghapus konten');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      showToast(error.message, 'error');
    }
  };

  const handleToggleActive = async (content) => {
    try {
      const res = await apiCall(`/api/admin/collaboration-content/${content.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...content, isActive: !content.isActive }),
      });

      const json = await res.json();

      if (json?.success) {
        showToast(content.isActive ? 'Konten dinonaktifkan' : 'Konten diaktifkan', 'success');
        fetchContents();
      } else {
        throw new Error(json?.message || 'Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error toggling active:', error);
      showToast(error.message, 'error');
    }
  };

  return (
    <Card className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Konten Halaman Kolaborasi</h2>
          <p className="mt-2 text-sm text-gray-600">
            Kelola konten yang ditampilkan di halaman kolaborasi publik
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ bgcolor: '#E93C8E', '&:hover': { bgcolor: '#d63581' } }}
        >
          Tambah Konten
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E93C8E] border-t-transparent"></div>
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {contents.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-500">
                Belum ada konten. Klik "Tambah Konten" untuk membuat konten pertama.
              </p>
            </div>
          ) : (
            contents.map((content) => (
              <div
                key={content.id}
                className={`rounded-lg border-2 p-6 transition-all ${
                  content.isActive ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{content.heroTitle}</h3>
                      {content.isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          <CheckCircleIcon style={{ fontSize: 14 }} />
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {content.heroDescription}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Google Form:</span> {content.googleFormUrl}
                      </div>
                      <div>
                        <span className="font-medium">Updated:</span>{' '}
                        {new Date(content.updatedAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => handleView(content)}
                      className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                      title="Lihat Detail"
                    >
                      <VisibilityIcon style={{ fontSize: 18 }} />
                    </button>
                    <button
                      onClick={() => handleEdit(content)}
                      className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                      title="Edit"
                    >
                      <EditIcon style={{ fontSize: 18 }} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(content)}
                      className={`rounded-md p-2 ${
                        content.isActive
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                      title={content.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      <CheckCircleIcon style={{ fontSize: 18 }} />
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      title="Hapus"
                    >
                      <DeleteIcon style={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === 'create'
                  ? 'Tambah Konten'
                  : modalMode === 'edit'
                    ? 'Edit Konten'
                    : 'Detail Konten'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Panduan:</strong> Isi Hero Section, Google Form, dan minimal satu item
                  untuk setiap section (Mengapa, Skema, Alur). Centang "Aktifkan Konten" untuk
                  menampilkan di website.
                </p>
              </div>

              <div className="space-y-6">
                {/* Hero Section */}
                <div className="rounded-lg border-2 border-blue-200 bg-blue-50/30 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      1
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">Bagian Hero (Atas Halaman)</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Judul Utama (H1) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.heroTitle}
                        onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                        required
                        disabled={modalMode === 'view'}
                        placeholder="Contoh: Mari Berkolaborasi Bersama Kami"
                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50"
                      />
                      <p className="mt-1.5 text-xs text-gray-500">
                        Judul besar yang pertama kali dilihat pengunjung
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Deskripsi di Bawah H1 <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        value={formData.heroDescription}
                        onChange={(e) =>
                          setFormData({ ...formData, heroDescription: e.target.value })
                        }
                        required
                        disabled={modalMode === 'view'}
                        rows={4}
                        placeholder="Contoh: Kami membuka ruang kolaborasi bagi individu, komunitas, dan institusi..."
                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50"
                      />
                      <p className="mt-1.5 text-xs text-gray-500">
                        Paragraf penjelasan singkat di bawah judul utama
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="rounded-lg border-2 border-green-200 bg-green-50/30 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                      2
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">Tombol Ajukan Kolaborasi</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        URL Google Form <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="url"
                        value={formData.googleFormUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, googleFormUrl: e.target.value })
                        }
                        required
                        disabled={modalMode === 'view'}
                        placeholder="https://forms.google.com/d/xxxxx/viewform"
                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50"
                      />
                      <p className="mt-1.5 text-xs text-gray-500">
                        Link Google Form untuk pengajuan kolaborasi
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Deskripsi di Bawah Tombol <span className="text-gray-400">(Opsional)</span>
                      </label>
                      <textarea
                        value={formData.ctaDescription || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, ctaDescription: e.target.value })
                        }
                        disabled={modalMode === 'view'}
                        rows={2}
                        placeholder="Contoh: Isi formulir untuk mengajukan proposal kolaborasi"
                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50"
                      />
                      <p className="mt-1.5 text-xs text-gray-500">
                        Teks penjelasan di bawah tombol ajukan kolaborasi
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why Collaborate Section */}
                <div className="rounded-lg border-2 border-purple-200 bg-purple-50/30 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                      3
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">
                      Mengapa Berkolaborasi dengan Kami
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {formData.whyBenefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-purple-200 bg-white p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-700">
                            Item {idx + 1}
                          </span>
                          {formData.whyBenefits.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  whyBenefits: formData.whyBenefits.filter((_, i) => i !== idx),
                                })
                              }
                              disabled={modalMode === 'view'}
                              className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Judul
                          </label>
                          <input
                            type="text"
                            value={benefit.title}
                            onChange={(e) => {
                              const updated = [...formData.whyBenefits];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData({ ...formData, whyBenefits: updated });
                            }}
                            disabled={modalMode === 'view'}
                            placeholder="Contoh: Tim Profesional"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                          </label>
                          <textarea
                            value={benefit.description}
                            onChange={(e) => {
                              const updated = [...formData.whyBenefits];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setFormData({ ...formData, whyBenefits: updated });
                            }}
                            disabled={modalMode === 'view'}
                            rows={2}
                            placeholder="Penjelasan singkat tentang benefit ini"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gambar Card <span className="text-gray-400">(Opsional)</span>
                          </label>
                          <div className="space-y-2">
                            {benefit.imageUrl && (
                              <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                                <img
                                  src={benefit.imageUrl}
                                  alt={benefit.title}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formData.whyBenefits];
                                    updated[idx] = { ...updated[idx], imageUrl: '' };
                                    setFormData({ ...formData, whyBenefits: updated });
                                  }}
                                  disabled={modalMode === 'view'}
                                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, 'whyBenefits', idx);
                                }
                              }}
                              disabled={modalMode === 'view'}
                              className="w-full rounded-md border-2 border-dashed border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50 cursor-pointer"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Upload gambar JPG, PNG, GIF, WebP, atau SVG (max 5MB)
                          </p>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          whyBenefits: [
                            ...formData.whyBenefits,
                            { title: '', description: '', imageUrl: '' },
                          ],
                        })
                      }
                      disabled={modalMode === 'view'}
                      className="w-full py-2 px-4 rounded-md border-2 border-dashed border-purple-300 text-purple-600 text-sm font-medium hover:bg-purple-50 disabled:opacity-50"
                    >
                      + Tambah Item
                    </button>
                  </div>
                </div>

                {/* Schemes Section */}
                <div className="rounded-lg border-2 border-orange-200 bg-orange-50/30 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                      4
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">Skema Kolaborasi</h4>
                  </div>

                  <div className="space-y-4">
                    {formData.schemes.map((scheme, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-orange-200 bg-white p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-700">
                            Skema {idx + 1}
                          </span>
                          {formData.schemes.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  schemes: formData.schemes.filter((_, i) => i !== idx),
                                })
                              }
                              disabled={modalMode === 'view'}
                              className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Skema
                          </label>
                          <input
                            type="text"
                            value={scheme.title}
                            onChange={(e) => {
                              const updated = [...formData.schemes];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData({ ...formData, schemes: updated });
                            }}
                            disabled={modalMode === 'view'}
                            placeholder="Contoh: Event Partnership"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Penjelasan
                          </label>
                          <textarea
                            value={scheme.description}
                            onChange={(e) => {
                              const updated = [...formData.schemes];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setFormData({ ...formData, schemes: updated });
                            }}
                            disabled={modalMode === 'view'}
                            rows={2}
                            placeholder="Jelaskan skema kolaborasi ini"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gambar Card <span className="text-gray-400">(Opsional)</span>
                          </label>
                          <div className="space-y-2">
                            {scheme.imageUrl && (
                              <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                                <img
                                  src={scheme.imageUrl}
                                  alt={scheme.title}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formData.schemes];
                                    updated[idx] = { ...updated[idx], imageUrl: '' };
                                    setFormData({ ...formData, schemes: updated });
                                  }}
                                  disabled={modalMode === 'view'}
                                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, 'schemes', idx);
                                }
                              }}
                              disabled={modalMode === 'view'}
                              className="w-full rounded-md border-2 border-dashed border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-gray-50 cursor-pointer"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Upload gambar JPG, PNG, GIF, WebP, atau SVG (max 5MB)
                          </p>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          schemes: [
                            ...formData.schemes,
                            { title: '', description: '', imageUrl: '' },
                          ],
                        })
                      }
                      disabled={modalMode === 'view'}
                      className="w-full py-2 px-4 rounded-md border-2 border-dashed border-orange-300 text-orange-600 text-sm font-medium hover:bg-orange-50 disabled:opacity-50"
                    >
                      + Tambah Skema
                    </button>
                  </div>
                </div>

                {/* Flow Section */}
                <div className="rounded-lg border-2 border-pink-200 bg-pink-50/30 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-600 text-sm font-bold text-white">
                      5
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">Alur Kolaborasi</h4>
                  </div>

                  <div className="space-y-4">
                    {formData.flowSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-pink-200 bg-white p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-700">
                            Langkah {idx + 1}
                          </span>
                          {formData.flowSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  flowSteps: formData.flowSteps.filter((_, i) => i !== idx),
                                })
                              }
                              disabled={modalMode === 'view'}
                              className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Judul Langkah
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const updated = [...formData.flowSteps];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData({ ...formData, flowSteps: updated });
                            }}
                            disabled={modalMode === 'view'}
                            placeholder="Contoh: Pengajuan Proposal"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Penjelasan
                          </label>
                          <textarea
                            value={step.description}
                            onChange={(e) => {
                              const updated = [...formData.flowSteps];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setFormData({ ...formData, flowSteps: updated });
                            }}
                            disabled={modalMode === 'view'}
                            rows={2}
                            placeholder="Jelaskan langkah ini"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gambar Card <span className="text-gray-400">(Opsional)</span>
                          </label>
                          <div className="space-y-2">
                            {step.imageUrl && (
                              <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                                <img
                                  src={step.imageUrl}
                                  alt={step.title}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formData.flowSteps];
                                    updated[idx] = { ...updated[idx], imageUrl: '' };
                                    setFormData({ ...formData, flowSteps: updated });
                                  }}
                                  disabled={modalMode === 'view'}
                                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, 'flowSteps', idx);
                                }
                              }}
                              disabled={modalMode === 'view'}
                              className="w-full rounded-md border-2 border-dashed border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:bg-gray-50 cursor-pointer"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Upload gambar JPG, PNG, GIF, WebP, atau SVG (max 5MB)
                          </p>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newStep = formData.flowSteps.length + 1;
                        setFormData({
                          ...formData,
                          flowSteps: [
                            ...formData.flowSteps,
                            { step: String(newStep), title: '', description: '', imageUrl: '' },
                          ],
                        });
                      }}
                      disabled={modalMode === 'view'}
                      className="w-full py-2 px-4 rounded-md border-2 border-dashed border-pink-300 text-pink-600 text-sm font-medium hover:bg-pink-50 disabled:opacity-50"
                    >
                      + Tambah Langkah
                    </button>
                  </div>
                </div>

                {/* Status */}
                {modalMode !== 'view' && (
                  <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          Aktifkan Konten Ini
                        </span>
                        <p className="mt-1 text-xs text-gray-600">
                          Centang untuk menampilkan konten ini di halaman publik. Hanya satu konten
                          yang bisa aktif.
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setShowModal(false)}
                  sx={{ textTransform: 'none' }}
                >
                  {modalMode === 'view' ? 'Tutup' : 'Batal'}
                </Button>
                {modalMode !== 'view' && (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: '#E93C8E',
                      '&:hover': { bgcolor: '#d63581' },
                      textTransform: 'none',
                    }}
                  >
                    {modalMode === 'create' ? 'Simpan Konten' : 'Update Konten'}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.visible && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </Card>
  );
}
