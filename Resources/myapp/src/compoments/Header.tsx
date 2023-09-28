import { FilterOutlined } from '@ant-design/icons';
import { DatePicker, Drawer, Input, Select, SelectProps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom'

import { selectedInterval, setSelectedDates, useAppDispatch, useAppSelector } from '../@stores/MyStore';
import style from '../@styles/header.module.scss'
import { ISelectedDates } from '../@types/stores';
import { State, StoreState } from '../@types/storeState';

const { RangePicker } = DatePicker;

const activeClass = style.active + " " + style.link

const DateTimePresets: SelectProps['options'] = [
    { label: 'This Year', value: 'year' },
    { label: 'This Month', value: 'month' },
    { label: 'This Week', value: 'week' },
    { label: 'Today', value: 'day' },
    { label: 'LastWeek', value: 'lastWeek' },
    { label: 'LastMonth', value: 'lastMonth' },
    { label: 'LastYear', value: 'lastYear' },
]

const RefreshPresets: SelectProps['options'] = [
    { label: 'Second/s', value: 'sec' },
    { label: 'Minute/s', value: 'min' },
    { label: 'Hour/s', value: 'hour' },
    { label: 'Day/s', value: 'day' },
]

const Header = (props: {name?: string}) => {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [refreshUnits, setRefreshUnits] = useState('min')
    const [refresh, setRefresh] = useState(0)

    const useSelectedDates = useAppSelector((state: StoreState) => state.selectedDates as State<ISelectedDates>)

    const dispatch = useAppDispatch();

    const {dashboardId} = useParams() as { dashboardId: string }

    useEffect(() => {
        let amount = refresh;

        switch (refreshUnits) {
            case 'sec':
                if (amount < 60) {
                    return setRefresh(30);
                }
                break;
            case 'min':
                amount *= 60;
                if (amount < 30) {
                    return setRefresh(.5);
                }
                break;
            case 'hour':
                amount *= 3600;
                if (amount < 30) {
                    return setRefresh(.008);
                }
                break;
            case 'day':
                amount *= 86400;
                if (amount < 30) {
                    return setRefresh(.0003);
                }
                break;
            default:
                break;
        }
        dispatch(selectedInterval(amount))
    }, [dispatch, refresh, refreshUnits])


    useEffect(() => {
        dispatch(setSelectedDates({ startDate: dayjs().startOf("year").unix(), endDate: dayjs().endOf("year").unix() }))
    }, [dispatch])

    return (
        <div>
            <div className={style.main}>
                <span style={{ height: '100%', display: 'flex' }}>
                    <NavLink to="/" className={({ isActive }) => isActive ? activeClass : style.link} end>Home</NavLink>

                    {dashboardId && <NavLink to={`/dashboard/${dashboardId}`} className={({ isActive }) => isActive ? activeClass : style.link} end>{props.name}</NavLink>}
                </span>
                <span>
                    <NavLink className={style.link} style={{ float: 'right' }} onClick={() => setOpenDrawer(true)} to={''}><FilterOutlined /> Filters</NavLink>
                </span>
            </div>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <div>
                    <h3>DateTime Filter</h3>
                    <RangePicker
                        defaultValue={[dayjs(useSelectedDates.data.startDate * 1000), dayjs(useSelectedDates.data.endDate * 1000)]}
                        value={[dayjs(useSelectedDates.data.startDate * 1000), dayjs(useSelectedDates.data.endDate * 1000)]}
                        format={"DD/MM/YYYY"}
                        onChange={(dates) => {
                            if (dates) {
                                dispatch(setSelectedDates({ startDate: dates[0]?.startOf("day").unix(), endDate: dates[1]?.endOf("day").unix() }))
                            }
                        }}

                    />
                    <Select defaultValue={'year'} style={{ width: 120 }} onChange={(value) => {
                        switch (value) {
                            case 'year':
                                dispatch(setSelectedDates({ startDate: dayjs().startOf("year").unix(), endDate: dayjs().endOf("year").unix() }))
                                break;
                            case 'month':
                                dispatch(setSelectedDates({ startDate: dayjs().startOf("month").unix(), endDate: dayjs().endOf("month").unix() }))
                                break;
                            case 'week':
                                dispatch(setSelectedDates({ startDate: dayjs().startOf("week").unix(), endDate: dayjs().endOf("week").unix() }))
                                break;
                            case 'day':
                                dispatch(setSelectedDates({ startDate: dayjs().startOf("day").unix(), endDate: dayjs().endOf("day").unix() }))
                                break;
                            case 'lastWeek':
                                dispatch(setSelectedDates({ startDate: dayjs().subtract(1, 'week').startOf("week").unix(), endDate: dayjs().subtract(1, 'week').endOf("week").unix() }))
                                break;
                            case 'lastMonth':
                                dispatch(setSelectedDates({ startDate: dayjs().subtract(1, 'month').startOf("month").unix(), endDate: dayjs().subtract(1, 'month').endOf("month").unix() }))
                                break;
                            case 'lastYear':
                                dispatch(setSelectedDates({ startDate: dayjs().subtract(1, 'year').startOf("year").unix(), endDate: dayjs().subtract(1, 'year').endOf("year").unix() }))
                                break;

                            default:
                                break;
                        }
                    }} options={DateTimePresets} />

                </div>
                <div>
                    <h3>Refresh Interval</h3>
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <div>
                            <Input
                                type="number"
                                value={refresh}
                                defaultValue={0}
                                onChange={(e) => {
                                    setRefresh(Number(e.target.value))
                                }}
                                style={{ width: 100 }}
                                min={refreshUnits === 'sec' ? 30 : 0}
                            />
                        </div>
                        <Select defaultValue={refreshUnits} style={{ width: 120 }} onChange={setRefreshUnits} options={RefreshPresets} />
                    </div>
                </div>
            </Drawer>
        </div>
    )

}

export default Header