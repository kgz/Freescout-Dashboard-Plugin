import { createSlice } from "@reduxjs/toolkit";
import { state } from "./State";

export const UserStore = createSlice({
	name: 'store',
	initialState: state,
	reducers: {
		setSelectedDates: (state, data) => {
            state.selectedDates.data.startDate = data.payload.startDate
            state.selectedDates.data.endDate = data.payload.endDate
        },
        setResponseTimes: (state, data) => {
            state.responseTimes.data = [...data.payload, ...state.responseTimes.data]
        },
        resetResponseTimes: (state) => {
            state.responseTimes.data = []
        },
        setResponseTimesLoading: (state, data) => {
            state.responseTimes.loading = data.payload
        },
        setOpenTickets: (state, data) => {
            state.openTickets.data = [...data.payload, ...state.openTickets.data]
        },
        resetOpenTickets: (state) => {
            state.openTickets.data = []
        },
        setOpenTicketsLoading: (state, data) => {
            state.openTickets.loading = data.payload
        },
        setClosedTickets: (state, data) => {
            state.lastClosedTickets.data = data.payload
        },
        setClosedTicketsLoading: (state, data) => {
            state.lastClosedTickets.loading = data.payload
        },
        selectedInterval: (state, data) => {
            state.selectedInterval.data = data.payload
        },
	}
});