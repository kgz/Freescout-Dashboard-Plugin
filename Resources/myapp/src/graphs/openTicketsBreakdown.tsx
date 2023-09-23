import colors from "../@styles/_root.module.scss"
import "../@styles/index.module.scss"
import { Empty, Spin, Table } from 'antd';
import { RootState, useAppSelector } from '../@stores/MyStore';
import { State } from '../@types/storeState';
import { IOpenTickets } from "../@types/open_tickets";

//MRT Imports
//import MaterialReactTable from 'material-react-table'; //default import deprecated
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table';

//Material UI Imports
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';

//Date Picker Imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';
import { useMemo } from "react";



const OpenTicketsBreakdown = () => {
    const openTickets = useAppSelector((state: RootState) => state.openTickets as State<IOpenTickets[]>)

    const filtered: IOpenTickets[] = useMemo(() => {
        const temp = openTickets.data.filter((element) => element.status == 1);
        // sort by wait time
        temp.sort((a, b) => {
            return b.wait_time - a.wait_time
        }
        )

        return temp
    }, [openTickets.data])

    const columns: MRT_ColumnDef<IOpenTickets>[] =
        [
            {
                header: 'State',
                id: 'wait_time',
                Cell: ({ row }) => (
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            marginInline: 'auto',
                            backgroundColor: row.original.wait_time < 24 ? colors.success : row.original.wait_time < 24 * 7 ? colors.warning : colors.danger,
                        }}
                    />
                ),

                Header : ({ column }) => (
                    <span style={{ width:10, fontWeight: 700, marginInline:'auto' }}>State</span>
                ),
                size: 2,
            },
            {
                header: 'Company',
                id: 'company',
                Cell: ({ row }) => (<p>{row.original.company}</p>),
            },
            {
                header: 'Contact',
                Cell: ({ row }) => (<p>{row.original.customer_first_name + ' ' + row.original.customer_last_name}</p>),
            },
            {
                header: 'Wait Time',
                id: 'wait_time',
                Cell: ({ row }) => {

                    // pretty print the wait time, its currently in hours
                    const days = row.original.wait_time / 24;
                    // if its less than 1 day, show hours
                    if (days < 1) {
                        return <>{Math.round(days * 24)} hours</>
                    }
                    // if its less than 1 week, show days
                    if (days < 7) {
                        return <>{Math.round(days)} days</>
                    }
                    // if its more than 1 year, show years
                    if (days > 365) {
                        return <>{Math.round(days / 365)} years</>
                    }
                    // if its more than 1 month, show months
                    if (days > 30) {
                        return <>{Math.round(days / 30)} months</>
                    }
                    // if its more than 1 week, show weeks
                    if (days > 7) {
                        return <>{Math.round(days / 7)} weeks</>
                    }
                    return <>{days} days</>
                },
            },

            {
                header: 'Assigned',
                getGroupingValue: (row) => row.first_name + ' ' + row.last_name,
                id: 'responder',
                Cell: ({ row }) => (<p>{row.original.first_name + ' ' + row.original.last_name}</p>),
            }
        ]
    return (
        <div style={{
            fontWeight: 500,
            position: 'relative',
            width: '100%',
            // height: '800px',
            // overflow: 'auto',
            padding: 10,
            // marginTop: -30
            borderRadius: 3,

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
                    // display: 'flex',
                    // height: '100%',
                    paddingBottom: 10,
                    width: 'fit-content',
                }}>

                    <MaterialReactTable
                        columns={columns}
                        data={filtered}
                        enableColumnFilterModes
                        enableColumnOrdering
                        // enableGrouping
                        enableRowActions={false}
                        initialState={{ showColumnFilters: true, density: 'compact', sorting: [{ id: 'wait_time', desc: true }] }}
                        positionToolbarAlertBanner="bottom"
                        enableDensityToggle={false}
                        enableSorting={true}

                        // disable actions
                        enableSelectAll={false}
                        enableRowSelection={false}
                        muiTableBodyRowProps={({ row }) => {
                            return {
                                onClick: (event) => {
                                    console.log(row)
                                    window.open('/conversation/' + row.original.conversation_id, '_blank')
                                }
                            }

                        }}
                        renderTopToolbarCustomActions={({ table }) => (
                            <Typography
                                fontSize={14}
                                fontWeight={700}
                                color={colors.textTitle}
                                component="div"
                                sx={{
                                    paddingInline: '5px',
                                    backgroundColor: colors.secondarybg,
                                    width: '100%',
                                    position: 'sticky',
                                    lineHeight: '31px',
                                    height: '100%',
                                }}>
                                Open Tickets Waiting Response
                            </Typography>
                        )}

                        muiTopToolbarProps={{
                            // add a div wrapper around the top toolbar
                            className: 'test',
                            style: {
                                width: '99%',
                                margin: '0 auto',
                                background: colors.secondarybg,
                                fontWeight: 'bold',
                                fontSize: 14,
                                paddingBlock: 10,
                                marginBottom: 10,
                                top: 5,
                                borderRadius: 3,
                            }
                        }}

                        // renderDetailPanel={({ table }) => [
                        //     <>asdasd</>
                        // ]}

                        muiTableProps={{
                            sx: {
                                '& .MuiTableHead-root': {
                                    position: 'sticky',
                                    backgroundColor: colors.secondarybg,
                                    top: 0,
                                },
                                '& .MuiTableBody-root': {
                                    fontSize: 15,
                                },
                                
                                '& .MuiTableCell-root': {
                                    fontSize: 12,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    borderBottomWidth: '1px !important',
                                    borderBottomColor: 'rgba(224, 224, 224, .5) !important',
                                    borderBottomStyle: 'solid',
                                    minWidth: 0,
                                    '&:first-child': {
                                        width: 10,
                                    },
                                    maxWidth: 110,
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                },
                                '& .MuiTableCell-head': {
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    '&:first-child': {
                                        width: 30,
                                    },
                                },
                                // tableLayout: 'auto',
                                display: 'inline-block',
                                padding: 1,
                                width: '500px',
                            }
                        }}
                        muiBottomToolbarProps={{
                            sx: {
                                '& .MuiToolbar-root': {
                                    position: 'sticky',
                                    // backgroundColor: colors.secondarybg,
                                    top: 0,
                                   
                                },
                                '& *': {
                                    fontSize: 12,
                                    fontWeight: 500,
                                },
                                '& .MuiBox-root ': {
                                    // position: 'sticky',
                                    // backgroundColor: 'pink',
                                    position: 'sticky',
                                    // top: 0,
                                    // height: 400,
                                },
                            }
                        }}

                        muiTablePaperProps={{
                            sx: {
                                boxShadow: 'none',
                            }
                        }}
                    />


                </div>



            )}

        </div>

    )
}

export default OpenTicketsBreakdown