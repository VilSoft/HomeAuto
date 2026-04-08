"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { timeForm } from '@/interfaces'
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
  } from "@nextui-org/react";
import style from '@/styles/Swim.module.css'
import { setTimes } from '@/redux/features/swimSlices'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

const headers = [
    {key: "name", label: "NAME", sortDir: false}, 
    {key: "stroke", label: "STROKE", sortDir: false}, 
    {key: "distance", label: "DISTANCE", sortDir: false}, 
    {key: "unit", label: "UNIT", sortDir: false}, 
    {key: "time", label: "TIME", sortDir: false}, 
    {key: "date", label: "DATE", sortDir: false},
    {key: "age", label:  "AGE", sortDir: false}]

export function swimTable() {

    const [times, setTime] = useState<Array<timeForm>>([])
    const [gotTimes, setGotTime] = useState<boolean>(false)
    const [sort, setSort] = useState<string>('name')

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (gotTimes) return;
        const getTimes = async () => {
            const res = await fetch('/api/times/get', { 
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
            })
            let ret = res.json().then((data) => {
                data.formatted.sort((a: timeForm, b: timeForm) => (a.name < b.name ? 1 : -1))
                dispatch(setTimes(data.formatted))
                setTime(data.formatted)
            })

            setGotTime(true)
        }

        getTimes()
    }, [times, gotTimes])

    const sortDir = (a: any, b: any, dir: boolean) => {
        return dir ? (a > b ? 1 : -1) : (a < b ? 1 : -1);
    }

    const handleSort = (sortBy: keyof timeForm, index: number) => {
        setSort(sortBy)
        
        switch(sortBy) {
            case headers[0].key:
            case headers[1].key:
            case headers[2].key:
            case headers[3].key:
            case headers[6].key:
                setTime((data) => {
                    const dataToSort = [...data]
                    dataToSort.sort((a, b) => sortDir(a[sortBy],  b[sortBy], headers[index].sortDir))
                    return dataToSort
                })
                headers[index].sortDir = !headers[index].sortDir
                break;
            case headers[4].key:
                setTime((data) => {
                    const dataToSort = [...data]
                    dataToSort.sort((a, b) => {
                        let totalTimeA: number = a.time.minutes * 60 + a.time.seconds + a.time.miliseconds / 100;
                        let totalTimeB: number = b.time.minutes * 60 + b.time.seconds + b.time.miliseconds / 100;

                        return sortDir(totalTimeA, totalTimeB, headers[index].sortDir)
                    })
                    return dataToSort
                })
                headers[index].sortDir = !headers[index].sortDir
                break;
            case headers[5].key:
                setTime((data) => {
                    const dataToSort = [...data]
                    dataToSort.sort((a, b) => {
                        let tmpA: number = a.date.year * 10000 + a.date.month * 100 + a.date.day
                        let tmpB: number = b.date.year * 10000 + b.date.month * 100 + b.date.day

                        return sortDir(tmpA, tmpB, headers[index].sortDir)
                    })
                    return dataToSort
                })
                headers[index].sortDir = !headers[index].sortDir
                break;
        }
    }

    const classNames = useMemo(
        () => ({
            wrapper: ["max-h-[382px]", "max-w-3xl"],
            table: [style.table],
            thead: [style.head],
            tbody: [style.body],
        }), []
    )

    return (
        <Table removeWrapper classNames={classNames}>
            <TableHeader columns={headers}>
                {headers.map((h, index) => <TableColumn key={h.key} className={style.col} onClick={() => handleSort(h.key as keyof timeForm, index)}>
                    {h.label}&nbsp;{h.sortDir ? sort === h.key ? '▲' : '' : sort === h.key ? '▼' : ''}
                </TableColumn>)}
            </TableHeader>
            <TableBody className={style.bod}>
                {times.map((time, index) =>
                    <TableRow key={index} className={style.row}>
                        <TableCell className={style.td}>{time.name}</TableCell>
                        <TableCell className={style.td}>{time.stroke}</TableCell>
                        <TableCell className={style.td}>{String(time.distance)}</TableCell>
                        <TableCell className={style.td}>{time.unit}</TableCell>
                        <TableCell className={style.td}>{`${Number(time.time.minutes) > 0 ? `${time.time.minutes}:` : ''}${
                            Number(time.time.seconds) < 10 ? `0${time.time.seconds}` : time.time.seconds}.${
                            Number(time.time.miliseconds) < 10 ? `0${time.time.miliseconds}` : time.time.miliseconds}`}</TableCell>
                        <TableCell className={style.td}>{`${time.date.month}/${time.date.day}/${time.date.year}`}</TableCell>
                        <TableCell className={style.td}>{String(time.age)}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default swimTable