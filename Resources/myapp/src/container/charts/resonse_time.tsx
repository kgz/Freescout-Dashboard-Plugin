import { Line, TinyLine } from "@ant-design/charts"
import { Select } from "antd"
import { useContext, useEffect, useMemo, useState } from "react"
import { reponse_context } from "../container"

const ResponseTimeMini = () => {

    const ctx = useContext(reponse_context)
    const [selectedType, setSelectedType] = useState<string>('Business Hours')
    const {start, end, data} = ctx
    const types: any = {
        'Normal': 'real',
        'Business Hours': 'business',
    }

    const avaerage_response_time = useMemo(() => {
        const type = types[selectedType as string]
        const filtered_data = data.filter((item) => item.type === selectedType)
        console.log('filtered_data', filtered_data)
        // add all calculated_duration
        const total = filtered_data.reduce((acc, item) => {
            return acc + item.calculated_duration
        }, 0)
        // get average
        let o = (total / filtered_data.length)
        if (isNaN(o)) {
            return 0
        }
        return o.toFixed(2);
    }, [data, selectedType])

    const data2 = useMemo(() => {
        // for each day inbetween start and end get the avereage response time on that day
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24))
        const data3 = []
        for (let i = 0; i < days; i++) {
            const day = new Date(start + (1000 * 60 * 60 * 24 * i))
            const day_end = new Date(start + (1000 * 60 * 60 * 24 * (i + 1)))
            const filtered_data = data.filter((item) => {
                return item.conversation_created_at_timestamp > day.getTime()
                    && item.conversation_created_at_timestamp < day_end.getTime()
                    && item.type === selectedType
            })
            // add all calculated_duration
            const total = filtered_data.reduce((acc, item) => {
                return acc + item.calculated_duration
            }, 0)
            // get average
            const average = (total / filtered_data.length)
            // if is nan then set to 0
            if (isNaN(average)) {
                data3.push(0)
                continue
            }
            data3.push(parseFloat(average.toFixed(2)))
        }
        console.log(data3)
        return data3
    }, [data, start, end, selectedType])


                


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
                        <p>{items[0].value} Hours</p>
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
                marginBottom: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div
                    style={{
                        fontSize: '42px',
                        fontWeight: 'bold',
                        // color: '#1890ff'

                    }}>
                </div>
                <div
                    style={{
                        fontSize: '42px',
                        fontWeight: 'bold',
                        // color: '#1890ff'
                    }}
                    >
                    {avaerage_response_time} Hours

                </div>
                Average {types[selectedType as string]} wait time

                
            <TinyLine {...config}  />
            <div style={{
                float: 'right',
                // bottom
                bottom: '30',
                alignSelf: 'flex-end',
                marginRight: '1rem',
                marginTop: '40px'
            }}
            >

                <Select
                    defaultValue="Business Hours"
                    style={{ width: 150 }}
                    onChange={(value) => setSelectedType(value)}
                    size="small"
                >
                    {Object.keys(types).map((type, index) => {
                        return <Select.Option key={index + "type"} value={type}
                        >{type}</Select.Option>
                    })}
                </Select>
            </div>
            </div>
        </div>
    )
}

export default ResponseTimeMini