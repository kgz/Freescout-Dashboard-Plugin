import { Typography } from '@mui/material';
import { Empty, Spin } from 'antd';
import TimeAgo from 'react-timeago'
import { IClosedTickets } from "src/@types/closed_tickets";

import { RootState, useAppSelector } from '../@stores/MyStore';
import colors from "../@styles/_root.module.scss"
import { State } from '../@types/storeState';

import "../@styles/index.module.scss"

const LastClosures = () => {
    const closedTickets = useAppSelector((state: RootState) => state.lastClosedTickets as State<IClosedTickets[]>)

    // const filtered: IClosedTickets[] = useMemo(() => {
    //     // const temp = openTickets.data.filter((element) => element.status == 1);
    //     // // sort by wait time
    //     // temp.sort((a, b) => {
    //     //     return b.wait_time - a.wait_time
    //     // }
    //     // )

    //     return temp
    // }, [openTickets.data])

    
    return (
        <div style={{
            fontWeight: 500,
            position: 'relative',
            width: '100%',
            // height: '800px',
            // overflow: 'auto',
            // marginTop: -30
            borderRadius: 3,

        }}>
            {closedTickets.loading &&
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

            {!closedTickets.loading && (closedTickets.data.length < 1) &&
                <Empty style={{ marginTop: '40%' }} description={<>No Data Found.</>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            {!closedTickets.loading && closedTickets.data.length > 0 && (
                <div 
                style ={{

                }}
                >
                    {closedTickets.data.map((element, index) => {
                        // border color will be if less then a week green, if less then a month yellow, if more then a month red
                        const borderColor = element.wait_time < 24 * 7 ? 
                                colors.success : element.wait_time < 24 * 30 ? colors.warning : colors.danger
                        return (
                            <div
                                key={index}
                                style={{
                                    borderLeft: `3px solid ${borderColor}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-around',
                                    // alignItems: 'center',
                                    padding: 5,
                                    margin: 5,
                                }}
                            >
                                <Typography component={'div'} fontWeight={600}>
                                    ID={element.conversation_id}&nbsp;{element.company}&nbsp;{(element.customer_first_name ?? '') + ' ' + (element.customer_last_name ?? '')}
                                </Typography>
                                {/* closed within */}
                                <Typography component={'div'} fontWeight={400} color={borderColor}>
                                    Ticket Duration {Math.round(element.wait_time / 24 * 10) / 10} Days
                                </Typography>
                                {/* how long ago */}
                                <Typography component={'div'} fontWeight={400}>
                                    Closed By {element.closed_user_first_name}&nbsp;{element.closed_user_last_name}, <TimeAgo date={element.closed_at} />
                                </Typography>
                            
                            </div>
                        )
                    })}

                </div>



            )}

        </div>

    )
}

export default LastClosures