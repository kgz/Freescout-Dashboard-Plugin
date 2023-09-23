import { DatePicker } from 'antd';
import Button from 'antd/lib/button/button'
import dayjs from 'dayjs';
import { NavLink } from 'react-router-dom'

import { setSelectedDates, useAppDispatch, useAppSelector } from '../@stores/MyStore';
import style from '../@styles/header.module.scss'
import { ISelectedDates } from '../@types/stores';
import { State, StoreState } from '../@types/storeState';

const { RangePicker } = DatePicker;

const activeClass = style.active + " " + style.link

const Header = () => {
    const useSelectedDates = useAppSelector((state: StoreState) => state.selectedDates as State<ISelectedDates>)
    const dispatch = useAppDispatch();
    return (
        <>
            <div className={style.main}>
                <NavLink to="/" className={({ isActive }) => isActive ? activeClass : style.link} end>Home</NavLink>
            </div>
            <RangePicker
                defaultValue={[dayjs(useSelectedDates.data.startDate *1000), dayjs(useSelectedDates.data.endDate * 1000)]}
                value={[dayjs(useSelectedDates.data.startDate * 1000), dayjs(useSelectedDates.data.endDate * 1000)]}
                format={"DD/MM/YYYY"}
                onChange={(dates) => {
                    if (dates) {
                        console.log(dates)
                        dispatch(setSelectedDates({ startDate: dates[0]?.startOf("day").unix(), endDate: dates[1]?.endOf("day").unix() }))
                    }
                }}

            />
               <Button onClick={() => {
                // dispatch({ type: "setSelectedDates", payload: { startDate: dayjs().startOf("month").toString(), endDate: dayjs().endOf("month").toString() } })
                dispatch(setSelectedDates({ startDate: dayjs().startOf("year").unix(), endDate: dayjs().endOf("year").unix() }))
            }}>This Year</Button>
            <Button onClick={() => {
                // dispatch({ type: "setSelectedDates", payload: { startDate: dayjs().startOf("month").toString(), endDate: dayjs().endOf("month").toString() } })
                dispatch(setSelectedDates({ startDate: dayjs().startOf("month").unix(), endDate: dayjs().endOf("month").unix() }))
            }}>This Month</Button>
            <Button onClick={() => {
                dispatch(setSelectedDates ({ startDate: dayjs().startOf("week").unix(), endDate: dayjs().endOf("week").unix() }))
            }}>This Week</Button>
            <Button onClick={() => {
                dispatch(setSelectedDates ({ startDate: dayjs().startOf("day").unix(), endDate: dayjs().endOf("day").unix() }))
            }}>Today</Button>
        </>

    )

}

export default Header