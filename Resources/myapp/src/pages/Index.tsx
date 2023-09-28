import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Empty, Menu, MenuProps, Spin } from "antd";
import pLimit from "p-limit"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import { useScreenshot } from "use-screenshot-react-hook";

import { resetOpenTickets, resetResponseTimes, RootState, setClosedTickets, setClosedTicketsLoading, setOpenTickets, setOpenTicketsLoading, setResponseTimes, setResponseTimesLoading, useAppDispatch, useAppSelector } from "../@stores/MyStore"
import style from "../@styles/index.module.scss"
import { IDashboard } from "../@types/dashboard";
import { Tmodule } from "../@types/module";
import { ISelectedDates } from "../@types/stores"
import { State } from "../@types/storeState"
import { Masonry } from "../compoments/Grid";
import Header from "../compoments/Header";
import { Modules } from "../compoments/modules";

const Index = () => {
    const [loading, setLoading] = useState(false);
    const [selectedWidgets, setSelectedWidgets] = useState<IDashboard['elements']>([]);
    const useSelectedDates = useAppSelector((state: RootState) => state.selectedDates as State<ISelectedDates>)
    const useSelectedInterval = useAppSelector((state: RootState) => state.selectedInterval as State<number>)
    const dispatch = useAppDispatch();
    const { dashboardId } = useParams<{ dashboardId: string }>()
    const [dashboardName, setDashboardName] = useState('' as string)
    const { image, takeScreenShot } = useScreenshot({
        // we only want small images
        quality: 0.1,
        // we want pngs
        type: 'image/png',
        // size of the image
    })
    const ref = useRef(null)
    const [updateDashboard, setUpdateDashboard] = useState(0)


    const updateSelections = useCallback((data: IDashboard['elements']) => {
        if (typeof data !== 'object') {
            throw new Error('data is not an object')
        }
        ref.current && takeScreenShot(ref.current)
        fetch(`http://freescout.example.com/responses/api/dashboards/${dashboardId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') as string,
            },
            body: JSON.stringify({
                elements: data
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
            });
    }, [dashboardId, takeScreenShot])


    useEffect(() => {
        if (!dashboardId) {
            return
        }

        setLoading(true)
        const controller = new AbortController()
        const signal = controller.signal
        fetch('http://freescout.example.com/responses/api/dashboards/' + dashboardId, {
            method: 'GET',
            signal: signal,
        })
            .then(response => response.json())
            .then(data => {
                setSelectedWidgets(JSON.parse(data.elements))
                setDashboardName(data.name)
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setLoading(false)
            });
        return () => {
            controller.abort()
        }
    }, [dashboardId])



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
    }, [useSelectedDates.data.startDate, useSelectedDates.data.endDate, dispatch, updateDashboard])


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
    }, [useSelectedDates.data.startDate, useSelectedDates.data.endDate, dispatch, updateDashboard])

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
    }, [dispatch, updateDashboard])

    const widths: { [key: number]: number } = useMemo(() => {
        return {
            500: 1,
            750: 30,
            1000: 50,
            1250: 60,
            1500: 70,
            1750: 90,
            2000: 90,
            2250: 100,
            2500: 110,
            2750: 120,
            3000: 130,
            3250: 140,
            3500: 150,
            3750: 160,
            4000: 170,
            4250: 180,
            4500: 190,
        }
    }, [])

    const columns = useMemo(() => {
        let min = 0
        for (const [value] of Object.entries(widths)) {
            const max: number = parseInt(value)
            if (window.innerWidth >= min && window.innerWidth < max) {
                return widths[min]
            }
            min = max

        }

        return widths[min]
    }, [widths])

    const modulesToRender: Tmodule[] = useMemo(() => {
        return Modules.filter((module) => {
            return selectedWidgets.includes(module.id)
        })
    }, [selectedWidgets])

    const items = useMemo<MenuProps['items']>(() => {
        const modules = Modules
            .filter((module) => {
                return !selectedWidgets.includes(module.id)
            })
            .map((module, key) => {
                return {
                    label: module.id,
                    key: key,
                    onClick: () => {
                        setSelectedWidgets((sw) => [...sw, module.id])
                        updateSelections([...selectedWidgets, module.id])

                    }
                }
            })

        const remove = Modules
            .filter((module) => {
                return selectedWidgets.includes(module.id)
            })
            .map((module, key) => {
                return {
                    label: module.id,
                    key: key,
                    onClick: () => {
                        setSelectedWidgets((sw) => sw.filter((s) => s !== module.id))
                        updateSelections(selectedWidgets.filter((s) => s !== module.id))
                    }
                }
            })


        return [{
            label: 'Add Element',
            key: 'add',
            icon: <PlusOutlined />,
            children: modules
        }, {
            label: 'Remove Element',
            key: 'remove',
            icon: <MinusOutlined />,
            children: remove
        }]
    }, [setSelectedWidgets, selectedWidgets, updateSelections])

    useEffect(() => {
        console.log({ useSelectedInterval })
        if (!useSelectedInterval.data) {
            return
        }
        const timeout = setInterval(() => {
            setUpdateDashboard((ud) => ud + 1)
        }, useSelectedInterval.data * 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, [useSelectedInterval])

    useEffect(() => {
        if (image) {
            // send to update
            fetch(`http://freescout.example.com/responses/api/dashboards/${dashboardId}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') as string,
                },
                body: JSON.stringify({
                    image: image
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                }
                )
                .catch((error) => {
                    console.error('Error:', error);
                })
                .finally(() => {
                })
        }

    }, [dashboardId, image])

    return (
        <>
            <Header name={dashboardName}/>
            <Menu mode="horizontal" items={items} style={{ width: 300, float: 'left' }} />

            <div className={style.main} ref={ref}>
                {loading && <Spin />}
                {!modulesToRender.length && !loading && <Empty style={{ margin: '30 auto' }} description={'No Modules Selected'} />}
                {!loading && <Masonry columns={columns} items={
                    modulesToRender.map((module: Tmodule) => {
                        // wrap the module.item in a div with the correct size
                        return {
                            ...module,
                            item: (
                                <span style={columns === 30 ? {
                                    width: '100%'
                                } : {}}
                                >
                                    {module.item}
                                </span>
                            )
                        }
                    })
                }
                    style={
                        columns <= 30 ? {
                            margin: '0 auto'
                        } : {}
                    }
                />}
            </div>
        </>
    )
}

export default Index