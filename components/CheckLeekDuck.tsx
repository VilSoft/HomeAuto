"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Listbox, ListboxItem } from "@nextui-org/react"
import { duck } from '@/interfaces'
import style from '@/styles/Duck.module.css'

function CheckLeekDuck() {
  const [elements, setElements] = useState<Array<duck>>([])
  const [loaded, setLoaded] = useState<boolean>(false)

  const openDuck = (url: string) => {
    window.open(url, '_blank')?.focus()
  }

  useEffect(() => {
    if (loaded) return
    const getDuck = async () => {
      const res = await fetch('/api/ducks/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      res.json().then((data) => {
        setElements(data.formatted)
        setLoaded(true)
      })
    }
    getDuck()
  }, [loaded])

  return (
    <section className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-foreground">Pokémon GO Events</h2>
        <span className="text-xs text-foreground-subtle">via LeekDuck</span>
      </div>

      <motion.div
        className={style.DuckContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Listbox
          variant="flat"
          aria-label="Pokémon GO events"
          items={elements}
          classNames={{
            base: "w-full p-0",
            list: "p-0",
          }}
        >
          {(item) => (
            <ListboxItem
              className={style.item}
              onClick={() => openDuck(String(item.infoLink))}
              key={String(item._id)}
              textValue={String(item.name)}
            >
              <div className="flex gap-3 items-center">
                <img
                  alt={String(item.category)}
                  className={style.avatar}
                  src={String(item.img)}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                  <span className="text-xs text-foreground-muted">{item.date}</span>
                </div>
              </div>
            </ListboxItem>
          )}
        </Listbox>
      </motion.div>
    </section>
  )
}

export default CheckLeekDuck
