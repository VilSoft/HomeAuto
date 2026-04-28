import { motion } from 'framer-motion'
import style from '@/styles/Home.module.css'
import Layout from '@/components/Layout'
import Weather from '@/components/Weather'
import CheckLeekDuck from '@/components/CheckLeekDuck'
import QuickLinks from '@/components/QuickLinks'
import { staggerContainer, fadeUp } from '@/utils/animations'

export default function Home() {
  return (
    <Layout>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        <motion.div variants={fadeUp} custom={0}>
          <h1 className={style.title}>The Kai Kassie House</h1>
          <p className="text-sm text-foreground-muted">Home dashboard</p>
        </motion.div>

        <motion.div variants={fadeUp} custom={1}>
          <Weather />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div variants={fadeUp} custom={2} className="lg:col-span-3">
            <QuickLinks />
          </motion.div>
          <motion.div variants={fadeUp} custom={3} className="lg:col-span-2">
            <CheckLeekDuck />
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  )
}
