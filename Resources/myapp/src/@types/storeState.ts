export interface State<T> {
    refreshTime?: number|false;
        refreshIntervalSeconds: number|false;
        loading: boolean;
        data: T;
}
export interface StoreState {
    // @ts-ignore @typescript-eslint/no-explicit-any
    // @eslint-ignore @typescript-eslint/no-explicit-any
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