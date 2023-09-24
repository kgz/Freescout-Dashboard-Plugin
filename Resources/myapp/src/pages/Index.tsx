import pLimit from "p-limit"
import { useEffect } from "react"
import { useMediaQuery } from "react-responsive";

import { resetOpenTickets, resetResponseTimes, RootState, setClosedTickets, setClosedTicketsLoading, setOpenTickets, setOpenTicketsLoading, setResponseTimes, setResponseTimesLoading, useAppDispatch, useAppSelector } from "../@stores/MyStore"
import style from "../@styles/index.module.scss"
import { ISelectedDates } from "../@types/stores"
import { State } from "../@types/storeState"
import { Masonry } from "../compoments/Grid";
import { Modules } from "../compoments/modules";

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
                    dispatch(setOpenTicketsLoading(false))
                })

            })

        return () => {
            controller.abort()
        }
    }, [useSelectedDates.data.startDate, useSelectedDates.data.endDate, dispatch])

    useEffect(() => {
        dispatch(setClosedTicketsLoading(true))
        const controller = new AbortController()
        const signal = controller.signal
        fetch('http://freescout.example.com/responses/api/closed_responses', {
            method: 'GET',
            signal: signal,
        })
            .then(response => response.json())
            .then(data => {
                dispatch(setClosedTicketsLoading(false))
                dispatch(setClosedTickets(data))
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        return () => {
            controller.abort()
        }
    }, [dispatch])

    const isbigbigDesktop = useMediaQuery({ query: "(min-width: 1600px)" });
    const isBigDesktop = useMediaQuery({ query: "(min-width: 1200px) and (max-width: 1599.98px)" });
    const isSmallDesktop = useMediaQuery({
        query: "(min-width: 992px) and (max-width: 1199.98px)"
    });
    const isTablet = useMediaQuery({
        query: "(min-width: 500px) and (max-width: 991.98px)"
    });
    const isMobile = useMediaQuery({ query: "(max-width: 499.98px)" });

    const columns = () => {
        if (isbigbigDesktop) {
            return 100;
        }
        if (isBigDesktop) {
            return 80;
        }

        if (isSmallDesktop) {
            return 50;
        }

        if (isTablet) {
            return 40;
        }

        if (isMobile) {
            return 10;
        }
        return 1;
    };

    return (
        <div className={style.main}>
            <Masonry columns={columns()} items={
                [...Modules.map((module) => {
                    // wrap the module.item in a div with the correct size
                    return {
                        ...module,
                        item: (
                            <span className="asdasd">
                                {module.item}
                            </span>
                        )
                    }
                })]
            } />
        </div>
    )
}

export default Index