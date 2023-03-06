import { Select } from 'antd';
import { createContext, useEffect, useMemo, useState } from 'react';
import Card from './cards.tsx/card';
import Exports from './cards.tsx/modules/outstanding/exports';
import OutsandindCard from './cards.tsx/modules/outstanding/outstanding';
import ResponseByUser from './charts/reponseByUser';
import ResponseHealthMini from './charts/resonses.health.mini';
import ResponseMini from './charts/resonses.mini';
import ResponseTimeMini from './charts/resonse_time';
import styles from './container.module.scss';
import { OutstandingData, ResponseContext, responseType } from './types/data';

export const reponse_context = createContext<ResponseContext>({
    start: 0,
    end: 0,
    setStart: () => { },
    setEnd: () => { },
    data: [],
    setData: () => { },
    openTickets: [],
    setOpenTickets: () => { }
});


const Container = () => {

    const [data, setData] = useState<responseType[]>([])
    const [openTickets, setOpenTickets] = useState<OutstandingData[]>([])
    const [start, setStart] = useState<number>(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
    const [end, setEnd] = useState<number>(new Date().getTime())
    const [force_update, setForceUpdate] = useState<number>(0)
    const [customers, setCustomers] = useState<any[]>([])
    const [selectedCustomers, setSelectedCustomers] = useState<any[]>([])

    
    const filters = useMemo(() => {
        const filters:any = {};
        if (selectedCustomers.length > 0) {
            // filters.push({
            //     field: 'customer_id',
            //     operator: 'in',
            //     value: selectedCustomers.map((item) => {
            //         console.log(item)
            //         return item
            //     })
            // })
            filters['customer_ids'] = selectedCustomers
        }
        // start and end date
        filters['start'] = start
        filters['end'] = end
        return filters;
    }, [selectedCustomers, start, end])

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        let params = new URLSearchParams()
        params.append('filters', JSON.stringify(filters))


        fetch('/responses/api/response_times?' +  params.toString()
        , { 
            signal,
        })
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => console.log(err))

        return () => controller.abort()
    }, [force_update, filters])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetch('/responses/api/outstanding_resposes', { signal })
            .then(res => res.json())
            .then(res => setOpenTickets(res))
            .catch(err => console.log(err))

        return () => controller.abort()
    }, [force_update])




    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetch('/responses/api/customers', { signal })
            .then(res => res.json())
            .then(res => setCustomers(res))
            .catch(err => console.log(err))

        return () => controller.abort()
    }, [force_update])

    const update = () => {
        setForceUpdate((old) => old + 1)
    }

    useEffect(() => {
        update()
    }, [])

    return (
        <reponse_context.Provider value={{ start, end, setStart, setEnd, data, setData, openTickets, setOpenTickets }}>
            <div className={styles.container}>
            <Card headers={[]} style={{height:'100px'}}>

                <div>
                    {/* add 3 date selectors, 2 for time from and to then a 3rd with preselected values */}
             

                    {/* select with customers */}
                    <Select 
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select Customers"
                        value={selectedCustomers}
                        onChange={(value) => {
                            setSelectedCustomers(value)
                        }}
                        options={customers.map((item) => {
                            return {
                                label: item.first_name + ' ' + item.last_name,  
                                value: item.id
                            }
                        })}
                        // search on both value and label
                        filterOption={(input, option) =>{
                            if(!input || !option)
                                return false
                            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            return true
                        }
                            
                        }



                    />
                </div>
                <div>
                <button onClick={() => {
                        setStart(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
                        setEnd(new Date().getTime())
                    }}>Last 7 Days</button>
                    <button onClick={() => {
                        setStart(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
                        setEnd(new Date().getTime())
                    }}>Last 30 Days</button>
                    <button onClick={() => {
                        setStart(new Date().getTime() - 1000 * 60 * 60 * 24 * 365)
                        setEnd(new Date().getTime())
                    }}>Last Year</button>
                    <input type="date" value={new Date(start).toISOString().split('T')[0]} onChange={(e) => {
                        setStart(new Date(e.target.value).getTime())
                    }} />
                    <input type="date" value={new Date(end).toISOString().split('T')[0]} onChange={(e) => {
                        setEnd(new Date(e.target.value).getTime())
                    }} />
                </div>
                {/* export buttons */}
                <Exports/>
                    
                       


                </Card>
                <Card headers={['Avg. Reponses', 'Avg. Wait Time', 'Response Health']}>
                    <ResponseMini />
                    <ResponseTimeMini />
                    <ResponseHealthMini />
                </Card>
                <div className={styles.body}>
                    <Card headers={['Outstanding Responses']} style={{height:"450px", padding:0}}>
                        <OutsandindCard />
                    </Card>
                    <Card headers={['Response Time By User (hours)']}  style={{height:"450px", padding:0}}>
                        <ResponseByUser/>
                    </Card>
                </div>
            </div>
           
        </reponse_context.Provider>
    );
};

export default Container;
