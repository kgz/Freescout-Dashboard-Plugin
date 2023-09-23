import { useEffect, useMemo } from "react"
import colors from "../@styles/_root.module.scss"
import "../@styles/index.module.scss"
import { Empty, Spin } from 'antd';
import { RootState, useAppSelector } from '../@stores/MyStore';
import { State } from '../@types/storeState';
import { IOpenTickets } from "../@types/open_tickets";


const OpenTicketsOverview = () => {
    const openTickets = useAppSelector((state: RootState) => state.openTickets as State<IOpenTickets[]>)

    type outType = {
        'low': number,
        'medium': number,
        'high': number,
        'total': number,
    }
    const PreparedData: outType = useMemo(() => {
        if (!openTickets?.data) return {
            'low': 0,
            'medium': 0,
            'high': 0,
            'total': 0,
        };
        // group by responder id and name and get the average

        // create 3 groups and get the cound of each group
        // anything less than 1 day is 1 group
        // anything less than 1 week is 1 group
        // anything more than 1 week is 1 group


        // filter by status 2, 1 == we are waiting reply
        const openTickets_waiting_response = openTickets.data.filter((element) => element.status == 1)

        const outData: outType = {
            'low': 0,
            'medium': 0,
            'high': 0,
            'total': openTickets_waiting_response.length,
        };
        // wait time is in hours
        openTickets_waiting_response.forEach(element => {
            if (element.wait_time < 48) {
                outData['low'] += 1
            } else if (element.wait_time < 24 * 7) {
                outData['medium'] += 1
            } else {
                outData['high'] += 1
            }
        });



        return outData
    }, [openTickets.data])

    useEffect(() => {
        console.log(openTickets)
    }, [openTickets])

    return (
        <div style={{
            fontWeight: 500,
            position: 'relative',
            width: '300px',
            height: '300px',
            overflow: 'auto',
            marginTop: -30

        }}>
            {openTickets.loading &&
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

            {!openTickets.loading && (openTickets.data.length < 1) &&
                <Empty style={{ marginTop: '40%' }} description={<>No Data Found.</>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            {!openTickets.loading && openTickets.data.length > 0 && (

                <div style={{
                    display: 'flex',
                    height: '100%',

                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        height: '90%',
                        // width: 100,
                        marginLeft: 20,
                    }}
                    >
                        <div>
                            <div style={{
                                fontSize: '40px',
                                fontWeight: 500,
                                height: 60
                            }}>
                                {PreparedData.low}
                            </div>
                            <div style={{
                                color: colors.success,
                                fontSize: '13px',
                                fontWeight: 700,
                                textAlign: 'left'
                            }}>&lt; 1 Day</div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '40px',
                                fontWeight: 500,
                                height: 60
                            }}>
                                {PreparedData.medium}
                            </div>
                            <div style={{
                                color: colors.warning,
                                fontSize: '13px',
                                fontWeight: 700,
                                textAlign: 'left'
                            }}>&lt; 1 week</div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '40px',
                                fontWeight: 500,
                                height: 60
                            }}>
                                {PreparedData.high}
                            </div>
                            <div style={{
                                color: colors.danger,
                                fontSize: '13px',
                                fontWeight: 700,
                                textAlign: 'left'
                            }}>
                                &gt; 1 week
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        height: '90%',
                        // width: 200,
                        marginLeft: 60,
                    }}>
                        {/* make 3 squares that fill with the percent*/}
                        <div style={{
                            width: 40,
                            background: colors.secondarybg,
                            height: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            marginLeft: 10,
                        }}>
                            <div style={{
                                width: '100%',
                                height: PreparedData.low / PreparedData.total * 100 + '%',
                                background: colors.success,
                                bottom: 0,
                            }} />

                        </div>
                        <div style={{
                            width: 40,
                            background: colors.secondarybg,
                            height: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            marginLeft: 10,

                        }}>
                            <div style={{
                                width: '100%',
                                height: PreparedData.medium / PreparedData.total * 100 + '%',
                                background: colors.warning,
                                bottom: 0,
                            }} />

                        </div>
                        <div style={{
                            width: 40,
                            background: colors.secondarybg,
                            height: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            marginLeft: 10,
                        }}>
                            <div style={{
                                width: '100%',
                                height: PreparedData.high / PreparedData.total * 100 + '%',
                                background: colors.danger,
                                bottom: 0,
                            }} />

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OpenTicketsOverview