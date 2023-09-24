import { Column, ColumnConfig } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import dayjs from "dayjs";
import { useMemo } from "react"

import { RootState, useAppSelector } from '../@stores/MyStore';
import { IDataEntity } from '../@types/response_times';
import { State } from '../@types/storeState';

import "../@styles/index.module.scss"

const ResponseTimesOverTime = () => {
    const useResponseTimes = useAppSelector((state: RootState) => state.responseTimes as State<IDataEntity[]>)

    type responders = {
        [month_year: string]: {
            data: {
                [responder_id: string]: {
                    month_year: string,
                    total: number,


                }
            },
            //total response time for the month
            total: number,
        }
    }
    const PreparedData: responders = useMemo(() => {
        if (!useResponseTimes?.data) return {};
        // group by responder id and name and get the total time for the month
        const responders: responders = {};

        useResponseTimes.data.forEach(element => {
            // const month_year = element.response_at
            const month_year = dayjs(element.response_at).format('YYYY-MM')
            if (!responders[month_year]) {
                responders[month_year] = {
                    data: {},
                    total: 0,
                }
            }
            if (!responders[month_year].data[element.responder]) {
                responders[month_year].data[element.responder] = {
                    month_year: month_year,
                    total: 0,
                }
            }
            responders[month_year].data[element.responder].total += 1
            responders[month_year].total += 1
        });

        // foreach of the data, change the responders total to a percentage
        Object.keys(responders).forEach((month_year) => {
            Object.keys(responders[month_year].data).forEach((responder_id) => {
                responders[month_year].data[responder_id].total = Math.round((responders[month_year].data[responder_id].total / responders[month_year].total) * 100)
            })
        })

        return responders
    }, [useResponseTimes.data])

    const flattenData = useMemo(() => {
        if (!PreparedData) return [];
        return Object.keys(PreparedData).map((month_year) => {
            return Object.keys(PreparedData[month_year].data).map((responder_id) => {
                return {
                    ...PreparedData[month_year].data[responder_id],
                    responder_id: responder_id,
                }
            })
        }).flat()
    }, [PreparedData])

    const config: ColumnConfig = {
        data: flattenData,
        xField: 'month_year',
        yField: 'total',
        seriesField: 'responder_id',
        isPercent: true,
        isStack: true,
        label: false,
        tooltip: false,
        yAxis: {
            label: {
                formatter: (v) => `${parseFloat(v) * 100}%`,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
                formatter: (v) => dayjs(v).format('MMM YYYY'),
            },
        },
        legend: {
            position: 'right',
            animate: true,
            itemWidth: 80,
        },
        interactions: [
            {
                type: 'element-highlight-by-color',
            },
            {
                type: 'element-link',
            },
        ],
    };
    return (
        <div style={{
            fontWeight: 500,
            position: 'relative',
            width: '300px',
            // height: '300px',
            overflow: 'auto',
        }}>
            {useResponseTimes.loading &&
                <div style={{
                    position: 'relative',
                    width: '300px',
                    height: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                    <Spin />
                </div>
            }

            {!useResponseTimes.loading && (useResponseTimes.data.length < 1) &&
                <Empty style={{ marginTop: '40%' }} description={<>No Data Found.</>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            {!useResponseTimes.loading && useResponseTimes.data.length > 0 && (

                <Column
                    {...config}
                />
            )}
        </div>

    )
}

export default ResponseTimesOverTime