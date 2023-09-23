import Progress from "antd/es/progress/progress";
import { useEffect, useMemo } from "react"

import "../@styles/index.module.scss"
import { Empty, Spin } from 'antd';
import { RootState, useAppSelector } from '../@stores/MyStore';
import { State } from '../@types/storeState';
import { IDataEntity } from 'src/@types/response_times';
import colors from "../@styles/_root.module.scss"


const ResponseTimes = () => {
    const useResponseTimes = useAppSelector((state: RootState) => state.responseTimes as State<IDataEntity[]>)

    type responders = {
        [key: string]: {
            avg: number,
            min?: number,
            max: number,
            total: number,
        }
    }
    const PreparedData: responders = useMemo(() => {
        if (!useResponseTimes?.data) return {};
        // group by responder id and name and get the average

        const responders: responders = {};

        useResponseTimes.data.forEach(element => {
            if (!responders[element.responder]) {
                responders[element.responder] = {
                    avg: 0,
                    min: undefined,
                    max: 0,
                    total: 0,
                }
            }
            responders[element.responder].total += 1
            responders[element.responder].avg = (responders[element.responder].avg + element.calculated_duration) / 2
            if  (
                (!responders[element.responder]?.min 
                || ((responders[element.responder]?.min || 9999999) > element.calculated_duration)) 
                && element.calculated_duration > 0) {
                responders[element.responder].min = element.calculated_duration
            }

            if (responders[element.responder].max < element.calculated_duration) {
                responders[element.responder].max = element.calculated_duration
            }
            
        });

        return responders
    }, [useResponseTimes.data])

    useEffect(() => {
        console.log(useResponseTimes)
    }, [useResponseTimes])

    return (
        <div style ={{
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
                <Empty style={{marginTop:'40%'}} description={<>No Data Found.</>} image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            }
            {!useResponseTimes.loading && useResponseTimes.data.length > 0 && (
 
                <>

                <table> 
                    <tr>
                        <th style={{width:150}}>Name</th>
                        <th style={{width:40}}>Min</th>
                        <th style={{width:40}}>Max</th>
                        <th style={{width:40}}>Avg</th>
                        <th style={{width:40}}></th>
                    </tr>
                    <tbody>

                {

                    Object.keys(PreparedData).sort(
                        (a, b) => PreparedData[b].avg - PreparedData[a].avg
                    ).map((key) => {

                        const percent =  PreparedData[key].avg / .07;
                        const color = percent < 30 ? colors.success : percent < 60 ? colors.warning : colors.danger;
                        const min = PreparedData[key]?.min || 0;
                     
                        // name Min Avg Max
                        return (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{
                                    min > 10 ? Math.round(min) 
                                    : Math.ceil(min * 10 ) / 10
                                }</td>                               
                                <td>{
                                    PreparedData[key].max > 10 ? Math.round(PreparedData[key].max) 
                                    : Math.ceil(PreparedData[key].max * 10 ) / 10
                                }</td>

                                <td>
                                <Progress percent={percent}
                                    strokeColor={color}
                                    trailColor='#f0f0f0'
                                    showInfo={false}
                                    size={[50, 10]}
                                    />
                                </td>
                                <td>{PreparedData[key].avg > 10 ? Math.round(PreparedData[key].avg)
                                    : Math.ceil(PreparedData[key].avg * 10 ) / 10
                                }</td>
                            </tr>
                        )
                        
                    })
                }
                    </tbody>
                </table>
                
                </>


            )}
        </div>

    )
}

export default ResponseTimes