import React from 'react'
import style from '@/styles/Masters.module.css'
import Layout from '@/components/Layout'
import SwimTable from '@/components/SwimTable'
import Chart from '@/components/Chart'

function Masters() {
  return (
    <Layout>
      <div className={style.master}>
          <h1 className={style.title}>Masters Times</h1>
          <div className={`container-fluid ${style.cont}`}>
              <div className={`row`}>
                  <Chart />
              </div>
              <div className={`row ${style.table}`}>
                  <SwimTable />
              </div>
          </div>
      </div>
    </Layout>
  )
}

export default Masters