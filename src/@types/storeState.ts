export interface State<T> {
    refreshTime?: number|false;
        needsRefresh: number|false;
        loading: boolean;
        data: T;
}
export interface StoreState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: State<any>;
}

export const newStoreState = <T,>(setNeedsRefresh: number|false, defaultData: T): State<T> => {
    return {
        refreshTime: false,
        needsRefresh: setNeedsRefresh,
        loading: false,
        data: defaultData as T,
    };
}