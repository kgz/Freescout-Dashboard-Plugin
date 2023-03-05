import { Tag } from "antd";
import { SortOrder } from "antd/es/table/interface";

export const columns = [
    {
        title: 'Id',
        dataIndex: 'conversation_id',
        key: 'id',
        width: 50,
    },
    {
        title: 'Client',
        dataIndex: 'customer_id',
        render: (index: any, record: any) => {
            if(!record.first_name)
                return <a href="#"></a>;
            return <p>{record.customer_first_name + ' ' + record.customer_last_name}</p>;
        },
        key: 'customer_id'
    },
    {
        title: 'Assigned To',
        dataIndex: 'assigned_to',
        key: 'assigned_to',
        render: (index: any, record: any) => {
            if(!record.first_name)
                return <a></a>;

            return <p>{record.first_name + ' ' + record.last_name}</p>;
        },
    },
    {
        title: 'Wait Time',
        dataIndex: 'wait_time',
        key: 'wait_time',
        render: (index: any, record: any) => {
            // render as dateutems ago
            // last reply at as utc to x ago as yyyy-mm-dd
       
            
            let date = new Date(record.last_reply_at);
            let now = new Date();

            let diff = (now.getTime() - date.getTime()) / 1000;
            
            var d = Math.floor(diff/(24*60*60)); /* though I hope she won't be working for consecutive days :) */
            diff = diff-(d*24*60*60);
            var h = Math.floor(diff/(60*60));
            diff = diff-(h*60*60);
            var m = Math.floor(diff/(60));
            diff = diff-(m*60);
            var s = Math.round(diff);


            let outstring = '';
            if(d > 0) {
                outstring += d + 'd ';
            }
            if(h > 0) {
                outstring += h + 'h ';
            }
            if(m > 0) {
                outstring += m + 'm ';
            }
            // if(s > 0) {
            //     outstring += s + 's ';
            // }



            return <p>{outstring}</p>;

        },
        sortable: true,
        sorter: (a: any, b: any) => (new Date(b.last_reply_at)).getTime() - (new Date(a.last_reply_at) ).getTime(),
        defaultSortOrder: 'descend' as SortOrder,
        // sortDirections: ['descend'],


    },
    {
        title: 'Last Reply',
        dataIndex: 'last_reply_at',
        key: 'last_reply_at',
        render: (index: any, record: any) => {
            //to local time
            if(!record.first_name)
                return <a ></a>;
            return new Date(record.last_reply_at).toLocaleString();
        },

    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (index: any, record: any) => {
            // 1 /active'
            // 2 pending
            // 3 closed'
            // 4 spam',
            switch(record.status) {
                case 1:
                    return <Tag color="green">Active</Tag>;
                case 2:
                    return <Tag color="orange">Pending</Tag>;
                case 3:
                    return <Tag color="red">Closed</Tag>;
                case 4:
                    return <Tag color="red">Spam</Tag>;
                default:
                    return ''
            }
        },
    },
    {
        title:'Goto Conversation',
        dataIndex: 'conversation_id',
        key: 'conversation_id1',
        render: (index: any, record: any) => {
            // /conversation/21
            if(!record.first_name)
                return <a style={{
                    height: '80px',
                    color:"transparent"
                }}> _<br/>_</a>;
            return <a target="_blank" href={`/conversation/${record.conversation_id}`}>Goto</a>;
        },


    }
];