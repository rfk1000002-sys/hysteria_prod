export default function ContactMap() {
  return (
    <section className="mt-14">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <iframe
          title="Google Maps"
          className="h-60 w-full md:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.9026038306443!2d110.408!3d-7.045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b0000000000%3A0x0000000000000000!2sSemarang!5e0!3m2!1sid!2sid!4v0000000000"
        />
      </div>
    </section>
  );
}
