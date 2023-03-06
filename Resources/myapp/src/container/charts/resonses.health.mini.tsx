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
        'perfect': 0,
        'good': 4,
        'ok': 8,
        'low': 16,
        // 'awful' : 8,
    }

    const healthColors: { [key: string]: string } = {
        'perfect': '#5d90f8',
        'good': '#09a785',
        'ok': '#ff8900',
        'low': '#ff0000a8',
        // 'awful' : '#f05a28',
    }


    const [data2, avg_health] = useMemo(() => {
        // calculate overall health for each conversation by calculated_duration
        // filter by selectedType
        const dd = data.filter((item) => item.type === selectedType)//.filter((item) => item.calculated_duration > 0)
        // map to health

        const data3 = dd.map((item) => {
            // group by the hrealth keys
            let type = null
            if (item.calculated_duration > healths.low) type = 'low'
            else if (item.calculated_duration > healths.ok) type = 'ok'
            else if (item.calculated_duration > healths.good) type = 'good'
            else type = 'perfect';
           

            return {
                type,
                calculated_duration: item.calculated_duration
            }

        })
        // count the number of each health and return a dict of healths and counts
        const data4: any = data3.reduce((acc: any, item: any) => {
            let type = item.type
            if (acc[type]) {
                acc[type] += 1
            } else {
                acc[type] = 1
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

        // get highest amount by count
        const totals = data6.reduce((acc: any, item: any) => {
            if (acc.count < item.value) {
                acc.count = item.value
                acc.type = item.type
            }
            return acc
        }, { count: 0, type: null })

        // get the health with the most responses
        console.log('total', totals) 

        const data7 = {
            type: totals.type || '',
            color: healthColors[totals.type] || ''
        }
        console.log('d7', data7)

        return [data6, data7] 

    }, [data, start, end])

   


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
                return Math.round(args.percent*100) + '%'
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