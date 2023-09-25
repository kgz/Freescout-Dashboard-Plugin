

export type IDashboard = {
    id:         number;
    name:       string;
    elements:   Array<string>;
    enabled:    number;
    deleted:    number;
    created_at: Date;
    updated_at: Date;
    deleted_at: null;
    created_by: number;
    updated_by: number;
    deleted_by: null;
}


export type IDashboardRaw = IDashboard &{
    elements: string;
}