'use server';

export async function unregisterAttendeeAction(prevState: any, formData: FormData) {
  console.log('unregisterAttendeeAction called');
  return { success: true };
}

export async function approveAttendeeAction(prevState: any, formData: FormData) {
  console.log('approveAttendeeAction called');
  return { success: true };
}

export async function rejectAttendeeAction(prevState: any, formData: FormData) {
  console.log('rejectAttendeeAction called');
  return { success: true };
}

export async function resendTicketLinkAction(prevState: any, formData: FormData) {
  console.log('resendTicketLinkAction called');
  return { success: true };
}

export async function registerAndCreateTicket(prevState: any, formData: FormData) {
  console.log('registerAndCreateTicket called');
  return { success: true };
}

export async function registerGuestForEvent(prevState: any, formData: FormData) {
  console.log('registerGuestForEvent called');
  return { success: true };
}
