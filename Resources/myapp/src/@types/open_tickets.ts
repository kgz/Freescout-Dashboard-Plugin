export interface IOpenTickets {
    conversation_id: number;
    created_at: string;
    customer_id: number;
    customer_first_name?: string | null;
    customer_last_name?: string | null;
    company?: null | string,
    first_name: string;
    last_name: string;
    user_id: number;
    last_reply_at: string;
    status: number;
    tcreated_at: string;
    type: number;
    wait_time: number;
  }
  