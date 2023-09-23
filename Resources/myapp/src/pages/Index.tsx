import { useEffect } from "react"
import { RootState, resetOpenTickets, resetResponseTimes, setOpenTickets, setOpenTicketsLoading, setResponseTimes, setResponseTimesLoading, useAppDispatch, useAppSelector } from "../@stores/MyStore"
import style from "../@styles/index.module.scss"
import { ISelectedDates } from "../@types/stores"
import { State } from "../@types/storeState"
import ResponseTimes from "../graphs/responseTimes"
import pLimit from "p-limit"
import OpenTicketsOverview from "../graphs/openTicketOverview"
import OpenTicketsBreakdown from "../graphs/openTicketsBreakdown"


const Index = () => {
    const useSelectedDates = useAppSelector((state: RootState) => state.selectedDates as State<ISelectedDates>)
    const dispatch = useAppDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams({
            start: useSelectedDates.data.startDate.toString(),
            end: useSelectedDates.data.endDate.toString(),
            getPages: '1'
        })
        const controller = new AbortController()
        const signal = controller.signal
        dispatch(setResponseTimesLoading(true))
        dispatch(resetResponseTimes())
        fetch('http://freescout.example.com/responses/api/response_times' + '?' + urlParams.toString(), {
            method: 'GET',
            signal: signal,
        })
            .then(response => response.json())
            .then(data => {
                const pages = data.total_pages
                //http://freescout.example.com/responses/api/response_times
                // run with p-limit
                const limit = 5;
                const limit2 = pLimit(limit);

                const fetchResponseTimes = async (page: number) => {

                    const urlParams = new URLSearchParams({
                        page: page.toString(),
                        start: useSelectedDates.data.startDate.toString(),
                        end: useSelectedDates.data.endDate.toString(),
                    })
                    const response = await fetch('http://freescout.example.com/responses/api/response_times' + '?' + urlParams.toString(), {
                        method: 'GET',
                        signal: signal,
                    })
                    const data = await response.json()
                    dispatch(setResponseTimes(data.data))
                }

                const urls = Array.from(Array(pages).keys())
                const input = urls.map((url) => limit2(() => fetchResponseTimes(url + 1)))
                Promise.all(input).then(() => {
                    console.log('Done')
                    dispatch(setResponseTimesLoading(false))
                })

            })

        return () => {
            controller.abort()
        }
    }, [useSelectedDates.data.startDate, useSelectedDates.data.endDate, dispatch])


    useEffect(() => {
        const urlParams = new URLSearchParams({
            end: useSelectedDates.data.endDate.toString(),
            getPages: '1'
        })
        const controller = new AbortController()
        const signal = controller.signal
        dispatch(setOpenTicketsLoading(true))
        dispatch(resetOpenTickets())
        fetch('http://freescout.example.com/responses/api/outstanding_resposes' + '?' + urlParams.toString(), {
            method: 'GET',
            signal: signal,
        })
            .then(response => response.json())
            .then(data => {
                const pages = data.total_pages
                //http://freescout.example.com/responses/api/response_times
                // run with p-limit
                const limit = 5;
                const limit2 = pLimit(limit);

                const fetchResponseTimes = async (page: number) => {

                    const urlParams = new URLSearchParams({
                        page: page.toString(),
                        end: useSelectedDates.data.endDate.toString(),
                    })
                    const response = await fetch('http://freescout.example.com/responses/api/outstanding_resposes' + '?' + urlParams.toString(), {
                        method: 'GET',
                        signal: signal,
                    })
                    const data = await response.json()
                    dispatch(setOpenTickets(data))
                }

                const urls = Array.from(Array(pages).keys())
                const input = urls.map((url) => limit2(() => fetchResponseTimes(url + 1)))
                Promise.all(input).then(() => {
                    console.log('Done')
                    dispatch(setOpenTicketsLoading(false))
                })

            })

        return () => {
            controller.abort()
        }
    }, [useSelectedDates.data.startDate, useSelectedDates.data.endDate, dispatch])



    return (
        <div className={style.main}>
            <div className={style.card} style={{ width: 350 }}>
                <div className={style.cardTitle}>Response Time By Responder (days)</div>
                <div className={style.cardBody}>
                    <ResponseTimes />
                </div>
            </div>
            <div className={style.card} style={{ width: 350 }}>
                <div className={style.cardTitle}>Waiting Response Overview</div>
                    <OpenTicketsOverview />
            </div>
            <div className={'asd'}>
                {/* <div className={style.cardTitle}>Waiting Response</div> */}
                {/* <div className={style.cardBody}> */} 
                <OpenTicketsBreakdown />
                {/* </div> */}
            </div>
         </div>
    )
}

export default Index