"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {Listbox, ListboxItem} from "@nextui-org/react";
import { duck } from '@/interfaces'
import style from '@/styles/Duck.module.css'

function CheckLeekDuck() {

    const [elements, setElements] = useState<Array<duck>>([])
    const [duck, setDuck] = useState<boolean>(false);

    const ListboxWrapper = ({children}:any) => (
        <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
            {children}
        </div>
    )
    
    const openDuck = (url: string) => {
        window.open(url, '_blank')?.focus();
    }

    useEffect(() => {

        if (duck) return
        const getDuck = async () => {
            const res = await fetch('/api/ducks/get', { 
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
            })
            res.json().then((data) => {
                setElements(data.formatted)  
                setDuck(true)           
            })
        }

        getDuck()

    }, [duck])

  return (
    <div className={`container ${style.DuckContainer}`}>
        <ListboxWrapper>
            <Listbox variant="flat" aria-label="Listbox menu with descriptions"
                items={elements}
            >
                {(item) => (
                    <ListboxItem className={style.item} onClick={() => openDuck(String(item.infoLink))} key={String(item._id)} textValue={String(item.category)} >
                        <div className="flex gap-2 items-center">
                            <img alt={String(item.category)} className={`flex-shrink-0 ${style.avatar}`} src={String(item.img)} />
                            <div className="flex flex-col">
                                <span className="text-small">{item.name}</span>
                                <span className="text-tiny text-default-400">{item.date}</span>
                            </div>
                        </div>
                    </ListboxItem>
                )}
            </Listbox>
        </ListboxWrapper>
    </div>
  )
}

export default CheckLeekDuck