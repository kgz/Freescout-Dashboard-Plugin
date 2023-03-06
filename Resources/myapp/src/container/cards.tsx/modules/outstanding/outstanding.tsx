import { Table } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { reponse_context } from "../../../container";
import { OutstandingData } from "../../../types/data";
import { columns } from "./outstanding.cfg";

const OutsandindCard = () => {
    const [data, setData] = useState<OutstandingData[]>([]);
    const ctx = useContext(reponse_context);
    const { openTickets } = ctx;

    const padded_data = useMemo(() => {
        // pad data to make it % of 5
        const pad = 5 - (openTickets.length % 5); 
        console.log('op', openTickets)
        const padded_data = [...openTickets];
        if (pad === 5) return padded_data;
        for (let i = 0; i < pad; i++) {
            padded_data.push({
                conversation_id : null,
                customer_id : null,
                wait_time : null,
            });
        }
        // add a full customer name
        padded_data.forEach((item) => {
            if (item.customer_id) {
                item.customer_full = item.customer_first_name + ' - ' + item.customer_last_name;
            }
        })

        return padded_data;
    }, [openTickets]);

    


    return (


        <div style={{
            width: '100%',
            height: '400px',
            // marginTop: '-20px'
        }}>
            <Table
                dataSource={padded_data}
                columns={columns}
                pagination={{
                    pageSize: 5,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
                // scroll={{ y: 250 }}
                size="small"
                // fixed columns
                
            />




        </div>
    )
}

export default OutsandindCard;