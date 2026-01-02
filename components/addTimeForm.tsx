"use client"
import React, { useState } from 'react'
import { timeForm } from '@/interfaces'
import style from '@/styles/TimeForm.module.css'
import { setTimes } from '@/redux/features/swimSlices'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

function addTimeForm(props: any) {

  let names: Array<string> = ["", "Kassie", "Kai"]
  let units: Array<string> = ["", "Yards", "Meters"]
  let distance: Array<number> = [0, 25, 50, 100, 200, 400, 500, 800, 1000, 1500, 1650]
  let strokes: Array<string> = ["", "Freestyle", "Backstroke", "Breaststroke", "Butterfly", "IM"]
  let formNames: Array<string> = ["name", "distance", "unit", "stroke", "min", "sec", "milisec", "age", "month", "date", "year", "meet"]

  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<timeForm>({
    _id: "",
    name: "",
    distance: 0,
    unit: "",
    stroke: "",
    time: {
      minutes: 0,
      seconds: 0,
      miliseconds: 0
    },
    age: 0,
    date: {
      month: 1,
      day: 1,
      year: 2000
    },
    meet: ""
  })

  const handleInput = (e: any) => {
    switch(e.target.name) {
      case formNames[0]:
        setFormData({...formData, name: e.target.value})
        break;
      case formNames[1]:
        setFormData({...formData, distance: Number(e.target.value)})
        break;
      case formNames[2]:
        setFormData({...formData, unit: e.target.value})
        break;
      case formNames[3]:
        setFormData({...formData, stroke: e.target.value})
        break;
      case formNames[4]:
        let tmpTimeMin = formData.time
        let setMin: number = Number(e.target.value)
        setMin < 0 ? setMin = 0 : setMin > 59 ? setMin = 59 : setMin
        tmpTimeMin.minutes = setMin
        setFormData({...formData, time: tmpTimeMin})
        break;
      case formNames[5]:
        let tmpTimeSec = formData.time
        let setSec: number = Number(e.target.value)
        setSec < 0 ? setSec = 0 : setSec > 59 ? setSec = 59 : setSec
        tmpTimeSec.seconds = setSec
        setFormData({...formData, time: tmpTimeSec})
        break;
      case formNames[6]:
        let tmpTimeMili = formData.time
        let setMil: number = Number(e.target.value)
        setMil < 0 ? setMil = 0 : setMil > 99 ? setMil = 99 : setMil
        tmpTimeMili.miliseconds = setMil
        setFormData({...formData, time: tmpTimeMili})
        break;
      case formNames[7]:
        setFormData({...formData, age: Number(e.target.value)})
        break;
      case formNames[8]:
        let tmpDateM = formData.date
        let setM: number = Number(e.target.value)
        setM < 1 ? setM = 1 : setM > 12 ? setM = 12 : setM
        tmpDateM.month = setM
        setFormData({...formData, date: tmpDateM})
        break;
      case formNames[9]:
        let tmpDateD = formData.date
        let setD: number = Number(e.target.value)
        setD < 1 ? setD = 1 : setD > 31 ? setD = 31 : setD
        tmpDateD.day = setD
        setFormData({...formData, date: tmpDateD})
        break;
      case formNames[10]:
        let tmpDateY = formData.date
        tmpDateY.year = Number(e.target.value)
        setFormData({...formData, date: tmpDateY})
        break;
      case formNames[11]:
        setFormData({...formData, meet: e.target.value})
        break;
    }

  }

  const onSubmit = async (event:any) => {
    event.preventDefault();
    const res = await fetch('/api/times/add', { 
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({formData})
    }).then(async () => {
      const res = await fetch('/api/times/get', { 
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }, 
      })
      let ret = res.json().then((data) => {
          data.formatted.sort((a: timeForm, b: timeForm) => (a.name < b.name ? 1 : -1))
          dispatch(setTimes(data.formatted))
      })
    }).then(() => props.setOpen(false))}

  return (
    <form className={style.form} onSubmit={onSubmit}>
      <label>Name:&nbsp;</label>
      <select className={style.entry} name={formNames[0]} onChange={handleInput}>
        {
          names.map((name, index) => 
            <option key={index}>{name}</option>
          )
        }
      </select><br/>

      <label>Distance:&nbsp;</label>  
      <select className={style.entry} name={formNames[1]} onChange={handleInput}>
        {
          distance.map((d, index) => 
            <option key={index}>{d}</option>
          )
        }
      </select><br/>

      <label>Unit:&nbsp;</label>
      <select className={style.entry} name={formNames[2]} onChange={handleInput}>
        {
          units.map((u, index) =>
            <option key={index}>{u}</option>  
          )
        }
      </select><br/>

      <label>Stroke:&nbsp;</label>
      <select className={style.entry} name={formNames[3]} onChange={handleInput}>
        {
          strokes.map((stroke, index) => 
            <option key={index}>{stroke}</option>  
          )
        }
      </select><br/>

      <label>Time:&nbsp;</label>
      <input className={`border-b-2 ${style.input} ${style.entry}`} name={formNames[4]} type="number" min="0" max="59" onChange={handleInput} />:
      <input className={`border-b-2 ${style.input} ${style.entry}`} name={formNames[5]} type="number" min="0" max="59" onChange={handleInput} />.
      <input className={`border-b-2 ${style.input} ${style.entry}`} name={formNames[6]} type="number" min="0" max="99" onChange={handleInput} />
      <p>input miliseconds as two digit number (10 instead of 1, 50 instead of 5)</p>

      <label>Age:&nbsp;</label>
      <input className={`border-b-2 ${style.input} ${style.entry}`} name={formNames[7]} type="number" onChange={handleInput} /><br/>

      <label>Date:&nbsp;</label><br/>
      <input className={`border-b-2 ${style.input} ${style.entry}`} name={formNames[8]} type="number" min="1" max="12" onChange={handleInput} />/
      <input className={`border-b-2 ${style.input} ${style.entry}`} name={formNames[9]} type="number" min="1" max="31" onChange={handleInput} />/
      <input className={`border-b-2 ${style.input} ${style.entry}`} name={formNames[10]} type="number" onChange={handleInput} /><br/>

      <label>Meet:&nbsp;</label><br/>
      <input className={`border-b-2 ${style.entry}`} name={formNames[11]} type="text" onChange={handleInput} /><br/>

      <button className={style.button} type="submit">Add</button>
    </form>
  )
}

export default addTimeForm