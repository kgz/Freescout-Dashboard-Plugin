import { Line, Pie, TinyLine } from "@ant-design/charts"
import { useContext, useEffect, useMemo, useState } from "react"
import { reponse_context } from "../container"

const ResponseHealthMini = () => {


    const ctx = useContext(reponse_context)
    const { start, end, data } = ctx
    const selectedType = 'Business Hours'
    // const selectedType = 'Normal'


    //healths = greater then x response time in hours
    const healths: any = {
        'perfect': 2,
        'good': 4,
        'ok': 8,
        'low': 24,
        // 'awful' : 8,
    }

    const healthColors: { [key: string]: string } = {
        'perfect': '#5d90f8',
        'good': '#09a785',
        'ok': '#fffe5f',
        'low': '#ff8900',
        // 'awful' : '#f05a28',
    }


    const data2 = useMemo(() => {
        // calculate overall health for each conversation by calculated_duration
        // filter by selectedType
        const dd = data.filter((item) => item.type === selectedType)
        // map to health

        const data3 = dd.map((item) => {
            // group by the hrealth keys
            let type = 'low'
            if (item.calculated_duration < healths.terrible) type = 'low'
            if (item.calculated_duration < healths.ok) type = 'ok'
            if (item.calculated_duration < healths.good) type = 'good'
            if (item.calculated_duration < healths.perfect) type = 'perfect'

            return {
                type,
                calculated_duration: item.calculated_duration
            }

        })
        // count the number of each health and return a dict of healths and counts
        const data4: any = data3.reduce((acc: any, item: any) => {
            let type = item.type
            if (acc[type]) {
                acc[type] += item.calculated_duration
            } else {
                acc[type] = item.calculated_duration
            }
            return acc
        }, {})



        // return percentage of each health
        const total: number = Object.values(data4).reduce((acc: any, item: any) => acc + item, 0) as number
        const data5 = Object.keys(data4).map((key) => {
            return {
                type: key,
                value: Math.round(data4[key] / total * 10000) / 100,
                color: healthColors[key]
            }
        })

        // filter out 0 values
        const data6 = data5.filter((item) => item.value > 0)


        // make sure the data is sorted by health
        data6.sort((a: any, b: any) => {
            return healths[a.type] - healths[b.type]
        })

        return data6

    }, [data, start, end])

    const avg_health = useMemo(() => {
        // return health witht he omst responses
        // filter by business hours
        const dd = data.filter((item) => item.type === selectedType)
        // filter out 0 values
        const data3 = dd.filter((item) => item.calculated_duration > 0)
        // filter by selectedType
        const data4 = data3.filter((item) => item.type === selectedType)
        // get the average response time
        console.log('data4', data4)

        const avg_response_time = data4.reduce((acc: any, item: any) => {
            return acc + item.calculated_duration
        }, 0) / data4.length
        // get the health with the most responses
        console.log('avg_response_time', avg_response_time)
        // get the response time for each health
        let typee = null;
        if (avg_response_time < healths.perfect) typee = 'perfect'
        if (avg_response_time < healths.good) typee = 'good'
        if (avg_response_time < healths.bad) typee = 'ok'
        if (avg_response_time < healths.terrible) typee = 'low'

        if (!typee) typee = 'low'


        return {
            type: typee,
            color: healthColors[typee]

        }


    }, [data])



    const config = {
        // appendPadding: 10,
        style: {
            width: '250px',
            height: '190px',
            margin: 'auto',
            // marginLeft: '40%',
            transform: 'translateX(40px)',
            marginTop: '-10px',
        },

        color: (datum: any) => {
            return healthColors[datum.type]
        },
        pieStyle: (datum: any) => {
            return { fill: healthColors[datum.type] };
        },

        data: data2,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            // offset: '-30%',
            content: (args: any) => {
                // return actual number
                return args.percent * 100 + '%'
            }
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };
    return (
        <div className="response-mini">
            <div style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginTop: '-10px',
            }}>
                <h2 style={{
                    color: avg_health.color,
                    padding: '0',
                    margin: '0',
                }}>
                    {avg_health.type.charAt(0).toUpperCase() + avg_health.type.slice(1)}
                </h2>
                <Pie  {...config} />
                Health based on average busisness response time

            </div>
        </div>
    )
}

export default ResponseHealthMini