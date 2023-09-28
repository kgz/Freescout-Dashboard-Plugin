import dayjs from "dayjs";
import { IClosedTickets } from "../@types/closed_tickets";
import { IOpenTickets } from "../@types/open_tickets";
import { IDataEntity } from "../@types/response_times";
import { StoreState, newStoreState } from "../@types/storeState";
import { ISelectedDates } from "../@types/stores";

export const state: StoreState = {
	selectedDates: newStoreState<ISelectedDates>(0, {
        startDate: dayjs().startOf("month").unix(),
        endDate:  dayjs().endOf("month").unix()
    }),
    responseTimes: newStoreState<IDataEntity[]>(0, []),
    openTickets: newStoreState<IOpenTickets[]>(0, []),
    lastClosedTickets: newStoreState<IClosedTickets[]>(0, []),
    selectedInterval: newStoreState<number>(0, 0), // as seconds
}