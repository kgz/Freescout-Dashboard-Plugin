export type responseType = {
    type: "Normal" | "Business Hours";
    "calculated_duration": number;
    "conversation_created_at_timestamp": number;
    "responder": string;
    "response_at": string;
    "conversation_id": number;
    [key : string] : any;
}

export type OutstandingData = {
    // type: "Normal" | "Business Hours";
    // "calculated_duration": number;
    // "conversation_created_at_timestamp": number;
    // "responder": string;
    // "response_at": string;
    // "conversation_id": number;
    [key : string] : any;
}
export type ResponseContext = {
    start: number;
    end: number;
    setStart: (start: number) => void;
    setEnd: (end: number) => void;
    data: responseType[];
    setData: (data: any) => void;
    openTickets: OutstandingData[];
    setOpenTickets: (data: any) => void;
}


