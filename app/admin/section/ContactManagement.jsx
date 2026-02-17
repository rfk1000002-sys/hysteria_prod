'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../lib/context/auth-context';
import Card from '../../../components/ui/Card';
import CrudModals from '../../../components/adminUI/CrudModals';
import Toast from '../../../components/ui/Toast';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

export default function ContactManagement() {
  const { apiCall } = useAuth();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    mapsEmbedUrl: '',
    locationTitle: '',
    locationAddress: '',
    operationalHours: '',
    whatsappNumber: '',
    phoneNumber: '',
    instagramUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    isActive: false,
  });
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });

  const fetchContact = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiCall('/api/admin/contact', { method: 'GET' });
      const json = await res.json().catch(() => null);
      if (json?.success) {
        const payload = json.data;
        let contactData = null;
        if (Array.isArray(payload)) {
          contactData = payload[0];
        } else if (payload && Array.isArray(payload.contacts)) {
          contactData = payload.contacts[0];
        }
        setContact(contactData || null);

        // Load form data if contact exists
        if (contactData) {
          setFormData({
            mapsEmbedUrl: contactData.mapsEmbedUrl || '',
            locationTitle: contactData.locationTitle || '',
            locationAddress: contactData.locationAddress || '',
            operationalHours: contactData.operationalHours || '',
            whatsappNumber: contactData.whatsappNumber || '',
            phoneNumber: contactData.phoneNumber || '',
            instagramUrl: contactData.instagramUrl || '',
            twitterUrl: contactData.twitterUrl || '',
            facebookUrl: contactData.facebookUrl || '',
            linkedinUrl: contactData.linkedinUrl || '',
            youtubeUrl: contactData.youtubeUrl || '',
            isActive: contactData.isActive,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    console.log('handleSubmit called with data:', data);

    const errors = validateForm(data);
    if (errors.length) {
      setToast({ visible: true, message: errors.join(' — '), type: 'error' });
      return false; // Return false to prevent modal close
    }

    try {
      const url = contact ? `/api/admin/contact/${contact.id}` : '/api/admin/contact';
      const method = contact ? 'PUT' : 'POST';

      console.log('Calling API:', { url, method, data });

      const res = await apiCall(url, {
        method,
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => null);
      console.log('API Response:', json);

      if (json?.success) {
        setShowModal(false);
        const returned = json.data || json.contact || null;
        if (returned) {
          setContact(returned);
          setFormData({
            mapsEmbedUrl: returned.mapsEmbedUrl || '',
            locationTitle: returned.locationTitle || '',
            locationAddress: returned.locationAddress || '',
            operationalHours: returned.operationalHours || '',
            whatsappNumber: returned.whatsappNumber || '',
            phoneNumber: returned.phoneNumber || '',
            instagramUrl: returned.instagramUrl || '',
            twitterUrl: returned.twitterUrl || '',
            facebookUrl: returned.facebookUrl || '',
            linkedinUrl: returned.linkedinUrl || '',
            youtubeUrl: returned.youtubeUrl || '',
            isActive: returned.isActive,
          });
        } else {
          fetchContact();
        }
        setToast({
          visible: true,
          message: `Contact ${contact ? 'berhasil diupdate' : 'berhasil dibuat'}`,
          type: 'success',
        });
        return true; // Return true to allow modal close
      } else {
        setToast({
          visible: true,
          message: json?.message || 'Gagal menyimpan data',
          type: 'error',
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      setToast({ visible: true, message: 'Gagal menyimpan data: ' + error.message, type: 'error' });
      return false;
    }
  };

  function validateForm(data) {
    const errs = [];

    if (!data.mapsEmbedUrl || String(data.mapsEmbedUrl).trim() === '') {
      errs.push('URL Google Maps wajib diisi');
    }

    if (!data.locationTitle || String(data.locationTitle).trim() === '') {
      errs.push('Judul lokasi wajib diisi');
    }

    if (!data.locationAddress || String(data.locationAddress).trim() === '') {
      errs.push('Alamat wajib diisi');
    }

    if (!data.operationalHours || String(data.operationalHours).trim() === '') {
      errs.push('Jam operasional wajib diisi');
    }

    if (!data.whatsappNumber || String(data.whatsappNumber).trim() === '') {
      errs.push('Nomor WhatsApp wajib diisi');
    }

    return errs;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-zinc-600">Loading...</div>
      </div>
    );
  }

  const fields = [
    {
      name: 'mapsEmbedUrl',
      label: 'Google Maps Embed URL',
      type: 'textarea',
      placeholder: 'https://www.google.com/maps/embed?...',
      rows: 3,
    },
    {
      name: 'locationTitle',
      label: 'Judul Lokasi',
      type: 'text',
      placeholder: 'Kantor Pusat Hysteria',
    },
    {
      name: 'locationAddress',
      label: 'Alamat Lengkap',
      type: 'textarea',
      placeholder: 'Jl. Contoh No. 123, Jakarta',
      rows: 3,
    },
    {
      name: 'operationalHours',
      label: 'Jam Operasional',
      type: 'textarea',
      placeholder: 'Senin - Jumat: 09:00 - 17:00\nSabtu: 09:00 - 13:00',
      rows: 3,
    },
    {
      name: 'whatsappNumber',
      label: 'Nomor WhatsApp (Tombol Mulai Diskusi)',
      type: 'text',
      placeholder: '+62812345678',
    },
    {
      name: 'phoneNumber',
      label: 'Nomor Telepon (Card Media Sosial)',
      type: 'text',
      placeholder: '(024) 8316860',
    },
    {
      name: 'instagramUrl',
      label: 'Instagram URL (Optional)',
      type: 'text',
      placeholder: 'https://instagram.com/hysteria',
    },
    {
      name: 'twitterUrl',
      label: 'Twitter URL (Optional)',
      type: 'text',
      placeholder: 'https://twitter.com/hysteria',
    },
    {
      name: 'facebookUrl',
      label: 'Facebook URL (Optional)',
      type: 'text',
      placeholder: 'https://facebook.com/hysteria',
    },
    {
      name: 'linkedinUrl',
      label: 'LinkedIn URL (Optional)',
      type: 'text',
      placeholder: 'https://linkedin.com/company/hysteria',
    },
    {
      name: 'youtubeUrl',
      label: 'YouTube URL (Optional)',
      type: 'text',
      placeholder: 'https://youtube.com/@hysteria',
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      placeholder: 'Set sebagai contact section aktif',
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-zinc-900">Contact Management</h1>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{ textTransform: 'none' }}
        >
          {contact ? 'Edit Contact' : 'Buat Contact'}
        </Button>
      </div>

      <Card>
        {contact ? (
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-700 mb-2">Lokasi</h3>
                <p className="text-lg font-bold text-zinc-900">{contact.locationTitle}</p>
                <p className="text-sm text-zinc-600 mt-1 whitespace-pre-line">
                  {contact.locationAddress}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-700 mb-2">Jam Operasional</h3>
                <p className="text-sm text-zinc-900 whitespace-pre-line">
                  {contact.operationalHours}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-zinc-700 mb-3">Kontak</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-zinc-500">WhatsApp (Tombol Diskusi):</span>
                  <p className="text-sm text-zinc-900">{contact.whatsappNumber}</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-500">Telepon (Card Media Sosial):</span>
                  <p className="text-sm text-zinc-900">{contact.phoneNumber || '-'}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-zinc-700 mb-3">Media Sosial</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contact.instagramUrl && (
                  <div>
                    <span className="text-xs text-zinc-500">Instagram:</span>
                    <a
                      href={contact.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block truncate"
                    >
                      {contact.instagramUrl}
                    </a>
                  </div>
                )}
                {contact.facebookUrl && (
                  <div>
                    <span className="text-xs text-zinc-500">Facebook:</span>
                    <a
                      href={contact.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block truncate"
                    >
                      {contact.facebookUrl}
                    </a>
                  </div>
                )}
                {contact.twitterUrl && (
                  <div>
                    <span className="text-xs text-zinc-500">Twitter:</span>
                    <a
                      href={contact.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block truncate"
                    >
                      {contact.twitterUrl}
                    </a>
                  </div>
                )}
                {contact.youtubeUrl && (
                  <div>
                    <span className="text-xs text-zinc-500">YouTube:</span>
                    <a
                      href={contact.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block truncate"
                    >
                      {contact.youtubeUrl}
                    </a>
                  </div>
                )}
                {contact.linkedinUrl && (
                  <div>
                    <span className="text-xs text-zinc-500">LinkedIn:</span>
                    <a
                      href={contact.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block truncate"
                    >
                      {contact.linkedinUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-zinc-700 mb-2">Google Maps</h3>
              <div className="overflow-hidden rounded-lg">
                <iframe
                  src={contact.mapsEmbedUrl}
                  className="w-full h-64"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <span
                className={`px-3 py-1 text-sm rounded ${contact.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}
              >
                {contact.isActive ? '✓ Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-zinc-600">
            <p className="mb-4">
              Belum ada data contact. Klik tombol <strong>"Buat Contact"</strong> di atas untuk
              membuat data pertama kali.
            </p>
            <p className="text-sm text-zinc-500">
              Setelah dibuat, data akan langsung ditampilkan di halaman kontak publik.
            </p>
          </div>
        )}
      </Card>

      <CrudModals
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode="edit"
        title={contact ? 'Edit Contact Information' : 'Buat Contact Information'}
        fields={fields}
        initialData={formData}
        onSubmit={handleSubmit}
      />

      <Toast
        show={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}
