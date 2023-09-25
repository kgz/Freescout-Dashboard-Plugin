import { configureStore, createSlice } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import thunk from "redux-thunk";
import { StoreState, newStoreState } from '../@types/storeState'
import { ISelectedDates } from '../@types/stores';
import dayjs from 'dayjs';
import { IDataEntity } from '../@types/response_times';
import { IOpenTickets } from '../@types/open_tickets';
import { IClosedTickets } from 'src/@types/closed_tickets';
import { Tmodule } from '../@types/module';

export const state: StoreState = {
	selectedDates: newStoreState<ISelectedDates>(0, {
        startDate: dayjs().startOf("month").unix(),
        endDate:  dayjs().endOf("month").unix()
    }),
    responseTimes: newStoreState<IDataEntity[]>(0, []),
    openTickets: newStoreState<IOpenTickets[]>(0, []),
    lastClosedTickets: newStoreState<IClosedTickets[]>(0, []),
    selectedModules: newStoreState<Tmodule[]>(0, []),
}

const UserStore = createSlice({
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


	}
});

// export const { incremented, decremented } = UserStore.actions
export const { 
    setSelectedDates,
    resetResponseTimes,
    setResponseTimes,
    setResponseTimesLoading,
    setOpenTickets,
    resetOpenTickets,
    setOpenTicketsLoading,
    setClosedTickets,
    setClosedTicketsLoading,
} = UserStore.actions;

const store = configureStore({
	reducer: UserStore.reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

// watch for changes in selectedUsers
store.subscribe(() => {
    // const selectedUsers = store.getState().selectedUsers.data
    // localStorage.setItem("selectedUsers", JSON.stringify(selectedUsers))

})

// export type RootState = ReturnType<typeof store.getState>
export type RootState = typeof state
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch

export default store
