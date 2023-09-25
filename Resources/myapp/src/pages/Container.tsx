import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Header from '../compoments/Header'
import Dashboard from '../compoments/Dashboard'
import Index from './Index'

const Container = () => {
    return (
        <BrowserRouter basename='/responses'>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/dashboard/:dashboardId" element={<Index/>}/>

            </Routes>
        </BrowserRouter>
    )
}

export default Container