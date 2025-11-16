import type { Database } from './database.types';

export type Event = Database['public']['Tables']['events']['Row'] & {
  template_id?: number | null;
  template_settings?: Record<string, unknown> | null;
  premium_features_enabled?: boolean | null;
  community_enabled?: boolean | null;
  community_features?: Array<{
    id?: number;
    feature_type: string;
    is_enabled: boolean;
    settings?: Record<string, unknown> | null;
  }>;
};
export type Profile = Database['public']['Tables']['profiles']['Row'] & { email?: string };
export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
export type Follower = Database['public']['Tables']['followers']['Row'];

type OrganizerProfile = {
    first_name: string | null;
    last_name: string | null;
} | null;


export type EventWithAttendees = Event & {
  attendees: number;
  ticket_id?: number;
  type?: 'attended' | 'organized';
  organizer?: Profile | null;
  organization?: Organization | null;
};

export type OrganizationWithOwner = Organization & {
  owner?: Profile | null;
  member_count?: number;
  follower_count?: number;
  is_following?: boolean;
  is_member?: boolean;
};

export type AttendeeFormResponse = {
  field_name: string;
  field_value: string;
};

export type Attendee = {
    ticket_id: number;
    checked_in: boolean;
    checked_out: boolean;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'expired' | 'checked_in' | 'checked_out' | 'unpaid' | 'cancelled' | 'unknown';
    avatar_url: string | null;
    form_responses?: AttendeeFormResponse[];
}

export type EventFormFieldOption = {
  id: number;
  value: string;
};

export type EventFormField = Database['public']['Tables']['event_form_fields']['Row'] & {
  options: EventFormFieldOption[] | null;
};

export type EventFormFieldWithOptions = Omit<EventFormField, 'id' | 'event_id' | 'order' | 'options'> & {
  options?: { value: string }[];
};

export type TicketWithRelations = Ticket & {
  events: Pick<
    Event,
    |
      'id'
      | 'title'
      | 'description'
      | 'date'
      | 'location'
      | 'cover_image'
      | 'is_paid'
      | 'price'
      | 'organization_id'
      | 'ticket_brand_logo'
      | 'ticket_brand_color'
      | 'ticket_background_image'
  > & {
    organization?: Pick<Organization, 'name'> | null;
  };
  profiles: (Profile & { email?: string | null }) | null;
};
    