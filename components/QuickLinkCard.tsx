import Image from "next/image"
import { motion } from "framer-motion"
import { fadeUp } from "@/utils/animations"
import { Service } from "./Service"
import style from '@/styles/Links.module.css'

interface QuickLinkCardProps {
  service: Service
  index: number
}

export default function QuickLinkCard({ service, index }: QuickLinkCardProps) {
  return (
    <motion.a
      variants={fadeUp}
      custom={index}
      whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97 }}
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center gap-3 p-4 text-center no-underline ${style.LinkContainer}`}
    >
      <div className="rounded-xl bg-[hsl(var(--primary)/0.1)] p-2.5 flex items-center justify-center">
        <Image
          src={service.icon}
          alt={service.name}
          width={36}
          height={36}
          className="rounded-md"
        />
      </div>
      <div className="max-w-full">
        <h3 className={`text-sm font-medium leading-tight ${style.text}`}>
          {service.name}
        </h3>
        {service.description && (
          <p className={`text-xs leading-tight mt-0.5 ${style.textMuted}`}>
            {service.description}
          </p>
        )}
      </div>
    </motion.a>
  )
}
