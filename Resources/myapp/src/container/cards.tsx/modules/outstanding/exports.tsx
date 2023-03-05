
import { useContext } from 'react';
import {CSVLink} from "react-csv";
import { reponse_context } from '../../../container';


const Exports = () => {
    const ctx = useContext(reponse_context);
    const {data, openTickets} = ctx;
    
    return (
        <>
            <CSVLink data={data}>Download Responses</CSVLink>
            <CSVLink data={openTickets}>Download Outstanding Responses.</CSVLink>
        </>
    );
};

export default Exports;