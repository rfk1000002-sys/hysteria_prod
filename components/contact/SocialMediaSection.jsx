import { Instagram, Facebook, Youtube, Mail, X, Music2 } from 'lucide-react';

export default function SocialMediaSection({ contactData }) {
  const instagram = contactData?.instagramUrl || 'https://instagram.com/grobakhysteria';
  const facebook = contactData?.facebookUrl || 'https://facebook.com/kolektifhysteria';
  const twitter = contactData?.twitterUrl || 'https://twitter.com/grobakhysteria';
  const youtube = contactData?.youtubeUrl || 'https://youtube.com/@kolektifhysteria';
  const tiktok = contactData?.tiktokUrl;
  const email = contactData?.email || 'hysteriakita59@gmail.com';

  return (
    <section className="mt-20 text-center">
      <h3 className="text-4xl font-extrabold tracking-tight">Terhubung di Media Sosial</h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-700">
        Dapatkan update terbaru tentang kegiatan, proyek, dan gerakan seni sosial kami
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Instagram */}
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg bg-white px-6 py-5 text-left shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
          >
            <div className="grid h-12 w-12 place-items-center rounded-md bg-white">
              <Instagram className="h-8 w-8 text-[#2F2237]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#2F2237]">Instagram</div>
              <div className="mt-1 text-xs text-zinc-600">Kolektif Hysteria</div>
            </div>
          </a>
        )}

        {/* Facebook */}
        {facebook && (
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg bg-white px-6 py-5 text-left shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
          >
            <div className="grid h-12 w-12 place-items-center rounded-md bg-white">
              <Facebook className="h-8 w-8 text-[#2F2237]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#2F2237]">Facebook</div>
              <div className="mt-1 text-xs text-zinc-600">Kolektif Hysteria</div>
            </div>
          </a>
        )}

        {/* Twitter/X */}
        {twitter && (
          <a
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg bg-white px-6 py-5 text-left shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
          >
            <div className="grid h-12 w-12 place-items-center rounded-md bg-white">
              <X className="h-8 w-8 text-[#2F2237]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#2F2237]">Twitter/X</div>
              <div className="mt-1 text-xs text-zinc-600">@grobakhysteria</div>
            </div>
          </a>
        )}

        {/* Youtube */}
        {youtube && (
          <a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg bg-white px-6 py-5 text-left shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
          >
            <div className="grid h-12 w-12 place-items-center rounded-md bg-white">
              <Youtube className="h-8 w-8 text-[#2F2237]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#2F2237]">Youtube</div>
              <div className="mt-1 text-xs text-zinc-600">Kolektif Hysteria</div>
            </div>
          </a>
        )}

        {/* Gmail */}
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-4 rounded-lg bg-white px-6 py-5 text-left shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
        >
          <div className="grid h-12 w-12 place-items-center rounded-md bg-white">
            <Mail className="h-8 w-8 text-[#2F2237]" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-[#2F2237]">Gmail</div>
            <div className="mt-1 text-xs text-zinc-600">{email}</div>
          </div>
        </a>

        {/* TikTok (optional) */}
        {tiktok && (
          <a
            href={tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg bg-white px-6 py-5 text-left shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
          >
            <div className="grid h-12 w-12 place-items-center rounded-md bg-white">
              <Music2 className="h-8 w-8 text-[#2F2237]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#2F2237]">TikTok</div>
              <div className="mt-1 text-xs text-zinc-600">Kolektif Hysteria</div>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}
