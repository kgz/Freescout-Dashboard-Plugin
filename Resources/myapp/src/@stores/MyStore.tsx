import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import thunk from "redux-thunk";
import { UserStore } from './StoreFunctions';
import { state } from './State';

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
    selectedInterval,
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
