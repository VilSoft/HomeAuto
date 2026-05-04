import Image from "next/image"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp } from "@/utils/animations"
import { Service } from "./Service"
import ApiKeyModal from "./ApiKeyModal"
import style from '@/styles/Links.module.css'

interface QuickLinkCardProps {
  service: Service
  index: number
}

type Toast = { id: number; success: boolean; msg: string }

const cardClass = (extra: string) =>
  `flex flex-col items-center gap-3 p-4 text-center no-underline ${extra}`

function CardInner({ service }: { service: Service }) {
  return (
    <>
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
    </>
  )
}

export default function QuickLinkCard({ service, index }: QuickLinkCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  function addToast(success: boolean, msg: string, duration = 5000) {
    const id = nextId.current++
    setToasts(prev => [...prev, { id, success, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }

  if (service.action?.type === 'api-key-prompt') {
    const { endpoint, method } = service.action

    function handleRun(apiKey: string) {
      addToast(true, `Started ${service.name}`)
      fetch(endpoint, { method, headers: { 'x-api-key': apiKey } })
        .then(res => {
          if (!res.ok) addToast(false, `Error ${res.status}`)
        })
        .catch(() => addToast(false, 'Network error'))
    }

    return (
      <>
        <motion.div
          variants={fadeUp}
          custom={index}
          whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className={cardClass(`${style.LinkContainer} cursor-pointer`)}
        >
          <CardInner service={service} />
        </motion.div>

        {modalOpen && (
          <ApiKeyModal
            serviceName={service.name}
            onRun={handleRun}
            onClose={() => setModalOpen(false)}
          />
        )}

        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <AnimatePresence>
            {toasts.map(t => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg ${
                  t.success ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {t.msg}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </>
    )
  }

  return (
    <motion.a
      variants={fadeUp}
      custom={index}
      whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97 }}
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass(`${style.LinkContainer}`)}
    >
      <CardInner service={service} />
    </motion.a>
  )
}
