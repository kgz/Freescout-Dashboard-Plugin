import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import { Button, Drawer, FloatButton, Form, Image, Input, Spin, Tag, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

import style from '../@styles/dashboard.module.scss'
import { IDashboard, IDashboardRaw } from '../@types/dashboard';
import Header from './Header';

const Dashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [dashboardList, setDashboardList] = useState([])
    const [needsUpdate, setNeedsUpdate] = useState(0)
    const [pendingCreate, setPendingCreate] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const abortController = new AbortController()
        const signal = abortController.signal
        fetch('http://freescout.example.com/responses/api/dashboards', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            signal: signal,
        })
            .then(response => response.json())
            .then(data => {
                setDashboardList(data)
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally(() => {
                setLoading(false)
            })
        return () => {
            abortController.abort()
        }
    }, [needsUpdate])

    const onFinish = (values: object) => {
        setPendingCreate(true)
        const controller = new AbortController()
        const signal = controller.signal
        fetch('http://freescout.example.com/responses/api/create_dashboard', {
            method: 'POST',
            signal: signal,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') as string,
            },
            body: JSON.stringify(values)
        })
            .then(response => response.json())
            .then(() => {
                setDrawerOpen(false)
                setNeedsUpdate((ld) => ld + 1)
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setPendingCreate(false)
            });
        return () => {
            controller.abort()
        }
    };

    const DashboardData: IDashboard[] = useMemo(() => {
        if (!dashboardList) return [];
        // map through and json parse the modules
        return dashboardList.map((element: IDashboardRaw) => {
            return {
                ...element,
                elements: JSON.parse(element.elements ?? '[]')
            }
        })
    }, [dashboardList])

    const cahceTime = useMemo(() => {
        return Date.now()
    }, [])

    return (
        <>
            <Header />

            <div className={style.main} style ={
                loading ? {
                    justifyContent:'center',
                    alignItems:'center',
                } : {}

            }>
                {/* <h1>Create Dashboard</h1>
                <Button onClick={() => setDrawerOpen(true)}>Open</Button> */}

                {loading && <Spin size="large" />}
                {!loading && DashboardData && DashboardData.map((element: IDashboard) => {
                    return (
                        <Tooltip key={element.id} title={()=>{
                            return (
                                <>
                                    {/* <img style={{
                                        height:'100%',
                                        width:'100%',
                                    }} src={'/img/dashboard_' + element.id + '.png'} alt={element.name} 
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            // overide with an empty text
                                            e.target.src = '/img/no-preview.png'
                                        }}

                                    
                                    /> */}
                                    <Image
                                        src={'/img/dashboard_' + element.id + '.png?t=' + cahceTime}
                                        fallback={'/img/no-preview.png'}
                                        style={{
                                            height:'100%',
                                            width:'100%',
                                        }}
                                        preview={false}
                                    />
                                </>
                            )
                        }} placement="right">
                            <NavLink key={element.id} to={`/dashboard/${element.id}`}>
                                <div key={element.id} className={style.dashboard}

                                >
                                    <div className={style.title}>
                                        {element.name}
                                    </div>
                                    <div className={style.content} >
                                        <>
                                            {console.log({ element })
                                            }
                                        </>
                                        {
                                            element?.elements && element?.elements?.map((module, key) => {
                                                return (
                                                    <div key={key}>

                                                        <Tag style={{ fontSize: 10 }} color="purple">{module?.split(/(?=[A-Z])/).join(" ")}</Tag>
                                                    </div>
                                                )
                                            })}
                                        {!element?.elements
                                            && <div className={style.module}>
                                                No Modules
                                            </div>
                                        }
                                    </div>

                                </div>
                            </NavLink>
                        </Tooltip>
                    )

                })
                }
            </div>

            <FloatButton onClick={() => setDrawerOpen(true)} icon={<PlusOutlined className={style.add} />} className={style.addContainer} />
            <Drawer title="Create New Dashboard" placement="right" onClose={() => setDrawerOpen(false)} open={drawerOpen}>
                {/* simple antd form with name and create button */}
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    layout='vertical'
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label={<>Dashboard&nbsp;Name:</>}
                        name="name"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={pendingCreate}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

export default Dashboard