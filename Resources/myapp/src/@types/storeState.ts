export interface State<T> {
    refreshTime?: number|false;
        refreshIntervalSeconds: number|false;
        loading: boolean;
        data: T;
}
export interface StoreState {
    [key: string]: State<any>;
}

export const newStoreState = <T,>(setRefreshIntervalSeconds: number|false, defaultData: T): State<T> => {
    return {
        refreshTime: false,
        refreshIntervalSeconds: setRefreshIntervalSeconds,
        loading: false,
        data: defaultData as T,
    };
}