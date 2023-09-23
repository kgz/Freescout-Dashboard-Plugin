import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Index from '../pages/Index'
import Header from './Header'

const Container = () => {
    return (
        <BrowserRouter basename='responses'>
            <Header />
            <Routes>
                <Route path="/" element={<Index/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Container