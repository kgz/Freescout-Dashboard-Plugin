import { configureStore, createSlice } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import thunk from "redux-thunk";
import { StoreState, newStoreState } from '../@types/storeState'
import { ISelectedDates } from '../@types/stores';
import dayjs from 'dayjs';
import { IDataEntity } from '../@types/response_times';
import { IOpenTickets } from '../@types/open_tickets';

export const state: StoreState = {
	selectedDates: newStoreState<ISelectedDates>(0, {
        startDate: dayjs().startOf("month").unix(),
        endDate:  dayjs().endOf("month").unix()
    }),
    responseTimes: newStoreState<IDataEntity[]>(0, []),
    openTickets: newStoreState<IOpenTickets[]>(0, []),
}

const UserStore = createSlice({
	name: 'store',
	initialState: state,
	reducers: {
		setSelectedDates: (state, data) => {
            console.log(data.payload)
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
        }



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
} = UserStore.actions;

const store = configureStore({
	reducer: UserStore.reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

// watch for changes in selectedUsers
store.subscribe(() => {
    // const selectedUsers = store.getState().selectedUsers.data
    // localStorage.setItem("selectedUsers", JSON.stringify(selectedUsers))

    console.log(store.getState().selectedDates.data)
})

// export type RootState = ReturnType<typeof store.getState>
export type RootState = typeof state
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch

export default store
