"use client"
import React, { useState } from 'react'
import Modal from '@/components/Modal'
import SwimTable from '@/components/SwimTable'
import AddTimeForm from '@/components/AddTimeForm'
import style from '@/styles/Swim.module.css'
import Link from 'next/link'

function swim() {

    const [open, setOpen] = useState<boolean>(false)

    const handleAddTime = async () => {
        setOpen(true)
    }

    return (
        <div>
            { open && <Modal onClose={() => setOpen(false)}>
                <AddTimeForm setOpen={setOpen}/>
            </Modal>}
            <div className={`container ${style.swimContainer}`}>
                <div className="row">
                    <h3 className={style.title}>
                       <Link href="/masters" className={style.link}> Masters Times</Link>
                    </h3>
                </div>
                <div className="row">
                    <SwimTable />
                </div>
                <div className={`row`}>
                    <button className={`btn btn-success ${style.button}`} onClick={() => handleAddTime()}>+</button>
                </div>
            </div>
        </div>
    )
}

export default swim