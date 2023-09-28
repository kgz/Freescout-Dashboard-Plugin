export interface IResponse_times {
    data?: (IDataEntity)[] | null;
    total: number;
    total_pages: number;
    page: number;
    per_page: number;
  }
  export interface IDataEntity {
    type: string;
    calculated_duration: number;
    conversation_created_at_timestamp: number;
    responder: string;
    response_at: number;
    conversation_id: number;
    start: string;
    end: string;
    customer_id: number;
    customer_first_name: string;
    customer_last_name?: string | null;
  }
  
  