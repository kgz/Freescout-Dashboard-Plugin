import style from "../@styles/index.module.scss"
import { Tmodule } from "../@types/module";
import LastClosures from "../modules/lastClosures";
import OpenTicketsOverview from "../modules/openTicketOverview";
import OpenTicketsBreakdown from "../modules/openTicketsBreakdown";
import PendingTicketsBreakdown from "../modules/pendingTicketsBreakdown";
import ResponseTimes from "../modules/responseTimes";
import ResponseTimesOverTime from "../modules/responseTimesOverTime";

export const Modules: Tmodule[] = [
    {
        id: 'OpenTicketsOverview',
        rows: 1,
        columns: 20,
        item: (

            <div className={style.card}>
                <div className={style.cardTitle}>Waiting Responses</div>
                <div className={style.cardBody}>
                    <OpenTicketsOverview />
                </div>
            </div>
        )
    },
    {
        id: 'ResponseTimes',
        rows: 2,
        columns: 20,
        item: (

            <div className={style.card}>
                <div className={style.cardTitle}>Response Time By Responder (days)</div>
                <div className={style.cardBody}>
                    <ResponseTimes />
                </div>
            </div>
        )
    },
    {
        id: 'openTicketsOverview',
        rows: 3,
        columns: 29,
        item: (

            <div className={style.card}>
                <OpenTicketsBreakdown />
            </div>
        )
    },

    {
        id: 'LastClosures',
        rows: 4,
        columns: 20,
        item: (
            <div className={style.card} style={{
                width: 350,
            }}>
                <div className={style.cardTitle}>Last 10 Closes</div>
                <div className={style.cardBody}>
                    <LastClosures />
                </div>
            </div>
        )
    },

    {
        id: 'ResponseTimesOverTime',
        rows: 1,
        columns: 20,
        item: (

            <div className={style.card}>
                <div className={style.cardTitle}>Response Time Contribution</div>
                <div className={style.cardBody}>
                    <ResponseTimesOverTime />
                </div>
            </div>
        )
    },
    {
        id: 'PendingTicketsBreakdown',
        rows: 3,
        columns: 29,
        item: (
            <div className={style.card} style={{
            }}>
                <PendingTicketsBreakdown />
            </div>
        )
    },
]
