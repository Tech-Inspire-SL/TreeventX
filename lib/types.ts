export type Event = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  price?: number | null;
  monime_account_id?: string;
  ticket_brand_color?: string | null;
  ticket_brand_logo?: string | null;
  ticket_background_image?: string | null;
  fee_bearer?: string | null;
  event_type?: string | null;
  organization_id?: string | null;
  organizer_id?: string | null;
  cover_image?: string | null;
  is_paid?: boolean;
  is_public?: boolean;
  requires_approval?: boolean;
  end_date?: string | null;
  capacity?: number | null;
  category?: string | null;
  type?: string;
  attendees_count?: number;
};

export type Ticket = {
  id: number;
  event_id: number;
  user_id: string;
  status: 'unpaid' | 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  qr_token?: string;
  monime_checkout_session_id?: string;
  monime_payment_status?: string;
  ticket_price?: number;
  amount_paid?: number;
  platform_fee?: number;
  payment_processor_fee?: number;
  organizer_amount?: number;
  fee_bearer?: string;
  checked_in?: boolean;
  checked_in_at?: string;
  checked_out?: boolean;
  checked_out_at?: string;
};

export type EventFormFieldWithOptions = {
  field_name: string;
  field_type: string;
  is_required: boolean;
  options?: { value: string }[];
};

export type EventWithAttendees = Event & {
  attendees: Attendee[];
};

export type Attendee = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'unknown' | 'checked_in' | 'checked_out';
  checked_in?: boolean;
  checked_out?: boolean;
  ticket_id?: number;
  form_responses?: any[];
};