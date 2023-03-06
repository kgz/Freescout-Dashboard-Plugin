import { Bar, Line } from "@ant-design/charts"
import { useContext, useEffect, useMemo } from "react"
import { reponse_context } from "../container"

declare var $: any
const ResponseByUser = () => {
    const ctx = useContext(reponse_context)
    const {data} = ctx

    const data2 = useMemo(() => {
        // calulate average response time for each user for both buisness hours and normal
        let users:{[key:string]: any} = {};
        data.forEach((item) => {
            if (!users[item.responder]) {
                users[item.responder] = {
                
                }
            }
            if(!users[item.responder][item.type]) {
                users[item.responder][item.type] = []
            }
            users[item.responder][item.type].push(item.calculated_duration)
        })
        console.log(data)
        const data3 = []
        for (const user in users) {
            const business = users[user]['Business Hours']
            const real = users[user]['Normal']
            const business_average = business.reduce((acc: any, item: any) => acc + item, 0) / business.length
            const real_average = real.reduce((acc: any, item: any) => acc + item, 0) / real.length
            data3.push({
                'label': user,
                'business': business_average,
                'real': real_average,
            })
        }
        
        // split into business and real
        const business = data3.map((item) => {
            return {
                'label': item.label,
                'type': 'Avg. Business Response',
                'value':  Math.round(item.business),
            }
        }
        )
        const real = data3.map((item) => {
            return {
                'label': item.label,
                'type': 'Avg. Real Response',
                'value': Math.round(item.real),
            }
        })

        // merge business and real
        const data4 = []
        for (let i = 0; i < business.length; i++) {
            data4.push(business[i])
            data4.push(real[i])
        }
        console.log(data4)
        return data4

    }, [data])
        
    useEffect(() => {
        $("#Response_user").find('#-axis-line').parent().find('[id*="-axis-label-"]').each((i: any, item: any) => {
            const text = $(item).text()
            const text2 = text.split(' ')[0]
            $(item).text(text2).css({
                'font-size': '12px',
                'font-weight': 'bold',
                // link color
                'fill': '#1383ab',
                cursor: 'pointer',
            })
            .on('click', () => {
                console.log('clicked')
            }
            )
        })
    }, [data2])

    const config = {
        renderer: 'svg' as "svg" | "canvas" | undefined,
        data: data2,
        isGroup: true,
        xField: 'value',
        yField: 'label',
        groupField: 'type',
        style:{
            minHeight:'300px'
        },
        /** 自定义颜色 */
        // color: ['#1383ab', '#c52125'],
        seriesField: 'type',
        marginRatio: 0,
        // on y axis item click
       
        // custom y axis label
        yAxis: {
            label: {
                formatter: (text: any) => {
                    return text
                },
            },
        },
      };

    return (
        <div id="Response_user">

            <Bar {...config} />
        </div>

    )

}

export default ResponseByUser
