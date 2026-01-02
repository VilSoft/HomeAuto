import QuickLinkCard from "./QuickLinkCard";
import { services } from "./Service";

export default function QuickLinks() {
  // Separate admin and regular services
  const regularServices = services.filter((s) => !s.admin);
  const adminServices = services.filter((s) => s.admin);

  return (
    <section className="mt-8">
      {/* Regular Services */}
      <h2 className="mb-4 text-lg font-semibold">Self-Hosted Services</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {regularServices.map((service) => (
          <QuickLinkCard key={service.id} service={service} />
        ))}
      </div>

      {/* Admin Services */}
      {adminServices.length > 0 && (
        <>
          <h2 className="mt-8 mb-4 text-lg font-semibold">Admin Services</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {adminServices.map((service) => (
              <QuickLinkCard key={service.id} service={service} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
