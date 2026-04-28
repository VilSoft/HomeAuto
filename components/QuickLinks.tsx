import { motion } from "framer-motion"
import { staggerContainer } from "@/utils/animations"
import QuickLinkCard from "./QuickLinkCard"
import { services } from "./Service"

export default function QuickLinks() {
  const regularServices = services.filter((s) => !s.admin)
  const adminServices = services.filter((s) => s.admin)

  return (
    <section className="rounded-xl border border-[hsl(var(--card-border))] bg-card p-6 shadow-card h-full">
      <h2 className="text-lg font-semibold text-foreground mb-5">Self-Hosted Services</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {regularServices.map((service, i) => (
          <QuickLinkCard key={service.id} service={service} index={i} />
        ))}
      </motion.div>

      {adminServices.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-foreground-muted mt-6 mb-3 uppercase tracking-wider">Admin</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {adminServices.map((service, i) => (
              <QuickLinkCard key={service.id} service={service} index={regularServices.length + i} />
            ))}
          </motion.div>
        </>
      )}
    </section>
  )
}
