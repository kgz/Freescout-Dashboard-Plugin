import { useState, useEffect, useMemo } from "react"
import { Line, Bar, Column, Pie } from '@ant-design/charts';
import { Card, DatePicker, Descriptions, Space } from 'antd';
import dayjs from 'dayjs';
import { Content } from "antd/es/layout/layout";

const MultiLine = () => {
    const [data, setData] = useState([])
    const [update, setUpdate] = useState(0)
    const [loading, setLoading] = useState(false)

    // end of this week
    const [end, setEend] = useState(dayjs().endOf('month').add(-1, 'month').toDate())
    // start of this week
    const [start, setSstart] = useState(dayjs().startOf('month').add(-1, 'month').toDate())
    // // start of this week


    const [avg_response_time, buisiness_response_time] = useMemo(() => {
        if (!data) return [0, 0]
        // get total 'normal'
        const normal = data.filter((d: any) => d.type === 'Normal').reduce((acc: any, cur: any) => acc + cur.calculated_duration, 0)
        // get total 'business'
        const business = data.filter((d: any) => d.type === 'Business Hours').reduce((acc: any, cur: any) => acc + cur.calculated_duration, 0)
        // get total business tickets
        const business_tickets = data.filter((d: any) => d.type === 'Business Hours').length
        // get total normal tickets
        const normal_tickets = data.filter((d: any) => d.type === 'Normal').length

        // get avg response time
        const avg_response_time = normal / normal_tickets
        // get avg business response time
        const buisiness_response_time = business / business_tickets
        return [avg_response_time, buisiness_response_time]

    }, [data])

    // calculate the top and quickets resonders
    const [topResponder, quickestResponder] = useMemo(() => {
        if (!data) return ["", ""]
        // get all the users
        const users = data.map((d: any) => d.responder)
        // get all the users and their total response time
        const users_response_time = users.map((u: any) => {
            const user_data = data.filter((d: any) => d.responder === u)
            const total_response_time = user_data.reduce((acc: any, cur: any) => acc + cur.calculated_duration, 0)
            return {
                user: u,
                total_response_time
            }
        })
        // sort by total response time

        const sorted_users_response_time = users_response_time.sort((a: any, b: any) => b.total_response_time - a.total_response_time)
        // get the top responder
        const topResponder = sorted_users_response_time[0]?.user
        // get the quickest responder
        const quickestResponder = sorted_users_response_time[sorted_users_response_time.length - 1]?.user
        return [topResponder, quickestResponder]
    }, [data])

    // calculate response time percents by full name
    const responseTimePercents = useMemo(() => {
        if (!data) return []
        // get all the users
        const total_business_response_time = data.filter((d: any) => d.type === 'Business Hours').reduce((acc: any, cur: any) => acc + cur.calculated_duration, 0)
        const total_normal_response_time = data.filter((d: any) => d.type === 'Normal').reduce((acc: any, cur: any) => acc + cur.calculated_duration, 0)
        const users = data.map((d: any) => d.responder)
        // unique users
        const unique_users = users.filter((v: any, i: any, a: any) => a.indexOf(v) === i)


        // foreach user get their total response time
        const response_time_percents = unique_users.map((u: any) => {
            const user_data = data.filter((d: any) => d.responder === u)
            const total_business_response_time_user = user_data.filter((d: any) => d.type === 'Business Hours').reduce((acc: any, cur: any) => acc + cur.calculated_duration, 0)
            const total_normal_response_time_user = user_data.filter((d: any) => d.type === 'Normal').reduce((acc: any, cur: any) => acc + cur.calculated_duration, 0)
            let business_percent = (total_business_response_time_user / total_business_response_time) * 100
            let normal_percent = (total_normal_response_time_user / total_normal_response_time) * 100
            // round to 2 decimal places
            business_percent = Math.round(business_percent * 100) / 100
            normal_percent = Math.round(normal_percent * 100) / 100
            return {
                user: u,
                business_percent,
                normal_percent
            }
        })
        return response_time_percents
    }, [data])


    useEffect(() => {
        console.log('response_time_percents', responseTimePercents)
    }, [responseTimePercents])


    useEffect(() => {
        const plot = document.querySelector('[data-chart-source-type=G2Plot]')
        const plot2 = document.querySelector('.antv-g2plot-column')
        if (plot) {
            plot.addEventListener('axis-label:dblclick', (e: any) => {
                console.log('e', e)

            })
        }

        return () => {
            if (plot) {
                plot.removeEventListener('click', (e: any) => {
                    console.log('e', e)
                })
            }
        }
    }, [data])

    const config = useMemo(() => {
        console.log(start, end)
        return {
            data,
            xField: 'conversation_created_at_timestamp',
            yField: 'calculated_duration',
            isGroup: true,
            groupFeild: 'type',
            isStack: true,
            seriesField: 'responder',
            // det x axis as date
            xAxis: {
                tickCount: 5,
                type: 'timeCat',
                // set format as 023-02-21 08:20:09
                mask: 'DD-MM-YY'
            },

            yAxis: {
                label: {
                    // 数值格式化为千分位
                    formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                },
            },

            // color: COLOR_PLATE_10,
            //    round hover values
            tooltip: {
                customContent: (title: any, items: any) => {
                    return (
                        <div className="custom-tooltip">
                            {/* format timestamp unix in local aus*/}
                            <p className="custom-tooltip-title">{new Date(items[0]?.data?.conversation_created_at_timestamp).toLocaleString()}</p>
                            <ul className="custom-tooltip-list">
                                {/* items.sort */}
                                {console.log('items', items, data)}
                                {/* {items.sort((a: any, b: any) => b.value - a.value).map((item: any, index: number) => (
                                    <>
    
                                        <li key={index} className="custom-tooltip-list-item">
                                            <span className="custom-tooltip-list-item-marker" style={{ backgroundColor: item.color }} />
                                            <span className="custom-tooltip-list-item-name">{item.name + ' ' + (item.data?.responder || '')}</span>
                                            <span className="custom-tooltip-list-item-value"> - {Math.round(item.value*100)/100}</span>
                                        </li>
                                    </>
                                ))} */}
                                {/* group value by type and responder */}
                                {items.map((item: any, index: number) => (
                                    <>
                                        <li key={index} className="custom-tooltip-list-item">
                                            <span className="custom-tooltip-list-item-marker" style={{ backgroundColor: item.color }} />
                                            <span className="custom-tooltip-list-item-name">{ (item.data?.responder || '')}</span>
                                            <span className="custom-tooltip-list-item-value"> - {Math.round(item.value * 100) / 100}</span>
                                        </li>
                                    </>
                                ))}
                                
                                
                            </ul>
                        </div>
                    );
                },
            },
            smooth: true,
            // @TODO 后续会换一种动画方式
            animation: {
                appear: {
                    animation: 'path-in',
                    duration: 500,
                },
            },

            brush: {
                enabled: true,
                type: 'x-rect' as any,

            },



        }
    }, [data])

    const config2 = useMemo(() => {
        return {
            ...config,
            // isGroup: true,
        }
    }, [config])


    useEffect(() => {

        if (start > end) {
            setSstart(end)
        }
        if (!start || !end) {
            return
        }
        setLoading(true)
        const controller = new AbortController()
        const signal = controller.signal
        const start_time = dayjs(start).unix();
        const end_time = dayjs(end).unix();
        fetch('/responses/api/response_times?start=' + start_time + '&end=' + end_time, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: signal,
        })
            .then(res => res.json())
            .then(res => {
                setData(res)
            })
            .finally(() => {
                setLoading(false)
            })

        return () => {
            controller.abort()
        }
    }, [update, start, end])

    useEffect(() => {
        setUpdate((old: any) => old + 1)
    }, [])

    const disabledTimeRangeEnd = (current: any) => {
        // cant select days before min
        return current && current < start;
    }

    const disabledTimeRangeStart = (current: any) => {
        // cant select days after max
        return current && current > end;
    }

    const PieData = useMemo(() => {
        // calculate percent by fullname
        // reduce by fullname count
        let ndata = []
        if (data) {
            const total = data.reduce((acc: any, cur: any) => acc + cur.calculated_duration, 0)
            const grouped = data.reduce((acc: any, cur: any) => {
                if (!acc[cur.responder]) {
                    acc[cur.responder] = {
                        responder: cur.responder,
                        value: 0,
                    }
                }
                acc[cur.responder].value += cur.calculated_duration
                return acc
            }, {})
            ndata = Object.values(grouped).map((item: any) => {
                return {
                    ...item,
                    percent: item.value / total,
                }
            })
        }

        return ndata
        // convert to array
    }, [data])

    const pieconfig1 = {
        appendPadding: 10,
        data: PieData,
        angleField: 'value',
        colorField: 'responder',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}',
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
    };

    const pieconfig2 = {
        ...pieconfig1,
        data: responseTimePercents,
        angleField: 'normal_percent',
        colorField: 'user',
    }
    const pieconfig3 = {
        ...pieconfig1,
        data: responseTimePercents,
        angleField: 'normal_percent',
        colorField: 'user',
    }
    const pieconfig4 = {
        ...pieconfig1,
        data: responseTimePercents,
        angleField: 'normal_percent',
        colorField: 'user',
    }

    return (
        <div>
            {/* {data && <Line {...config} />} */}
            {/* date selection */}
            <div className="date-selection">
                <div className="date-selection__item">
                    <label htmlFor="start">Start Date</label>
                    {/* add in max and min */}
                    {/* <input type="date" id="start" name="trip-start" value={start.toISOString().split('T')[0]} onChange={(e) => setSstart(new Date(e.target.value))}  />
                     */}
                    <DatePicker defaultValue={dayjs(start)} onChange={(date: any, dateString: any) => setSstart(date)} disabledDate={disabledTimeRangeStart} format={"DD/MM/YYYY"} />

                </div>
                <div className="date-selection__item">
                    <label htmlFor="end">End Date</label>
                    {/* <input type="date" id="end" name="trip-end" value={end.toISOString().split('T')[0]} onChange={(e) => setEend(new Date(e.target.value))} /> */}
                    <DatePicker defaultValue={dayjs(end)} onChange={(date: any, dateString: any) => setEend(date)} disabledDate={disabledTimeRangeEnd} format={"DD/MM/YYYY"} />
                </div>
                {/* refersh */}
                <div className="date-selection__item">
                    <button onClick={() => setUpdate((old: any) => old + 1)}>Refresh</button>
                </div>
            </div>

            {data && <Column loading={loading} {...config2} />}
            <Space direction="horizontal" size={16}>
                <Card title="Avg Response." style={{ width: 300 }}>
                    {Math.round(avg_response_time * 10) / 10}
                </Card>
                <Card title="Avg. Buisiness Response" style={{ width: 300 }}>
                    {buisiness_response_time}
                </Card>
                {/* best_responder, best_responder_time */}
                <Card title="Top Responder" style={{ width: 300 }}>
                    {topResponder}
                </Card>
                <Card title="Quickest Responder" style={{ width: 300 }}>
                    {quickestResponder}
                </Card>
            </Space>
            <Space style={{ width: '100%' }} direction="horizontal" size={16}>
                {/* <Descriptions title="Response by count">

            <Descriptions.Item>
                 {data && <Pie loading={loading} {...pieconfig} />}
            </Descriptions.Item>

            </Descriptions> */}
                <Card title="Response count by user" style={{ width: "20vw" }}>

                    {data && <Pie loading={loading} {...pieconfig1} />}
                </Card>
                <Card title="Response Time By User" style={{ width: "20vw" }}>

                    {data && <Pie loading={loading} {...pieconfig2} />}
                </Card>
                <Card title="Response count by user" style={{ width: "20vw" }}>

                    {data && <Pie loading={loading} {...pieconfig3} />}
                </Card>
                <Card title="Response count by user" style={{ width: "20vw" }}>

                    {data && <Pie loading={loading} {...pieconfig4} />}
                </Card>
            </Space>
        </div>
    )
}

export default MultiLine;