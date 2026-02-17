export default function ContactCTA({ contactData }) {
  const whatsappNumber = contactData?.whatsappNumber || '628121272483';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Halo%2C%20saya%20ingin%20memulai%20diskusi%20dengan%20Hysteria`;

  return (
    <section className="mt-20 bg-[#E93C8E]">
      <div className="mx-auto max-w-6xl px-6 py-14 text-center text-white">
        <h4 className="text-3xl font-extrabold">Mari Berkolaborasi</h4>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 opacity-95">
          Punya ide menarik? atau ingin bikin sesuatu yang unik?
          <br />
          Mari wujudkan lewat eksplorasi ide dan eksperimen bersama kami.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/kolaborasi"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#E93C8E] shadow hover:shadow-2xl hover:scale-105 hover:bg-gray-50 transition-all duration-200"
          >
            Ajukan Kolaborasi
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#E93C8E] shadow hover:shadow-2xl hover:scale-105 hover:bg-gray-50 transition-all duration-200"
          >
            Mulai Diskusi
          </a>
        </div>
      </div>
    </section>
  );
}
