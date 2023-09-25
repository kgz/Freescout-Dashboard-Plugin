import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, Menu, MenuProps, Spin } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import pLimit from "p-limit"
import { createRef, useEffect, useMemo, useRef, useState } from "react"
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { useScreenshot } from "use-screenshot-react-hook";

import { resetOpenTickets, resetResponseTimes, RootState, setClosedTickets, setClosedTicketsLoading, setOpenTickets, setOpenTicketsLoading, setResponseTimes, setResponseTimesLoading, useAppDispatch, useAppSelector } from "../@stores/MyStore"
import style from "../@styles/index.module.scss"
import { IDashboard } from "../@types/dashboard";
import { Tmodule } from "../@types/module";
import { ISelectedDates } from "../@types/stores"
import { State } from "../@types/storeState"
import { Masonry } from "../compoments/Grid";
import { Modules } from "../compoments/modules";

const Index = () => {
    const [loading, setLoading] = useState(false);
    const [selectedWidgets, setSelectedWidgets] = useState<IDashboard['elements']>([]);
    const useSelectedDates = useAppSelector((state: RootState) => state.selectedDates as State<ISelectedDates>)
    const dispatch = useAppDispatch();
    const { dashboardId } = useParams<{ dashboardId: string }>()
    const { image, takeScreenShot } = useScreenshot({
        // we only want small images
        quality: 0.1,
        // we want pngs
        type: 'image/png',
        // size of the image
        

    })
      const ref = useRef(null)


    const updateSelections = (data: IDashboard['elements']) => {
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
    }


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
    }, [Modules, setSelectedWidgets, selectedWidgets, updateSelections])

    useEffect(() => {
    
        // if image is not null, then open a new window with the image as blob
        console.log({ image })
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
                }
                )
                .finally(() => {
                })
                

            

        }

    }, [image])

    return (
        <>
            <Menu mode="horizontal" items={items} style={{ width: 300 }} />
            <div className={style.main}  ref={ref}>
                {loading && <Spin />}
                {!loading && <Masonry columns={columns()} items={
                    modulesToRender.map((module: Tmodule) => {
                        // wrap the module.item in a div with the correct size
                        return {
                            ...module,
                            item: (
                                <span className="asdasd">
                                    {module.item}
                                </span>
                            )
                        }
                    })
                } />}
            </div>
        </>
    )
}

export default Index