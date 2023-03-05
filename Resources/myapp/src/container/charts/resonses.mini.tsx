import { Line, TinyLine } from "@ant-design/charts"
import { useContext, useEffect, useMemo, useState } from "react"
import { reponse_context } from "../container"

const ResponseMini = () => {


    const ctx = useContext(reponse_context)
    const {start, end, data} = ctx


    const data2 = useMemo(() => {
        // for each day inbetween start and end get the count of responses on that day
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24))
        const data3 = []
        for (let i = 0; i < days; i++) {
            const day = new Date(start + (1000 * 60 * 60 * 24 * i))
            const day_end = new Date(start + (1000 * 60 * 60 * 24 * (i + 1)))
            const count_of_reponses = data.filter((d: any) => {
                return d.conversation_created_at_timestamp > day.getTime() 
                && d.conversation_created_at_timestamp < day_end.getTime()
                && d.type === 'Normal'
            }).length
            data3.push(count_of_reponses)
        }
        return data3
    }, [data, start, end])

    const average_per_day = useMemo(() => {
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24))
        const total = data2.reduce((a: any, b: any) => a + b, 0)
        return (total / days).toFixed(2)
    }, [data2, start, end])

    const config = {
        height: 60,
        autoFit: false,
        data: data2,
        smooth: true,
        tooltip: {
            // show date
            customContent: (_title:any, items:any) => {
                if(!items[0]) return null
                let index = parseInt(items[0].data.x)
                let date = new Date(start);
                date.setDate(date.getDate() + index);
                return (
                    <div style={{ padding: '8px 16px' }}>
                        <p>{date.toDateString()}</p>
                        <p>{items[0].value} Responses</p>
                    </div>
                )
            }
        },
    };
    return (
        <div className="response-mini">
            <div style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
            }}>
                <div
                    style={{
                        fontSize: '42px',
                        fontWeight: 'bold',
                        // color: '#1890ff'
                        
                    }}>
                    {average_per_day}
                </div>
                    Average reponses per day
            </div>
            <TinyLine {...config} />
        </div>
    )
}

export default ResponseMini