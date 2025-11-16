'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { setEventPinAction, removeEventPinAction } from '@/lib/actions/event-security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock } from 'lucide-react';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : children}
    </Button>
  );
}

export function PinSettings({ eventId, hasPin }: { eventId: number; hasPin: boolean }) {
  const { toast } = useToast();

  const [setState, setAction] = useFormState(setEventPinAction, null);
  const [removeState, removeAction] = useFormState(removeEventPinAction, null);

  useEffect(() => {
    if (setState?.error) {
      toast({ variant: 'destructive', title: 'Error', description: setState.error });
    }
    if (setState?.success) {
      toast({ title: 'Success', description: setState.message });
    }
  }, [setState, toast]);

  useEffect(() => {
    if (removeState?.error) {
      toast({ variant: 'destructive', title: 'Error', description: removeState.error });
    }
    if (removeState?.success) {
      toast({ title: 'Success', description: removeState.message });
    }
  }, [removeState, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event PIN Security</CardTitle>
        <CardDescription>
          {hasPin
            ? 'A PIN is set for this event. Organizers will be required to enter it before accessing this management page.'
            : 'Add a 4-digit PIN to prevent unauthorized access to your event management page.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasPin ? (
          <form action={removeAction}>
            <input type="hidden" name="eventId" value={eventId} />
            <Label htmlFor="currentPin">Enter Current PIN to Remove</Label>
            <div className="flex items-center gap-4 mt-2">
              <Input
                id="currentPin"
                name="currentPin"
                type="password"
                maxLength={4}
                required
                className="max-w-xs"
                placeholder="****"
              />
              <SubmitButton>
                <Unlock className="mr-2 h-4 w-4" />
                Remove PIN
              </SubmitButton>
            </div>
            {removeState?.error && <p className="text-sm text-destructive mt-2">{removeState.error}</p>}
          </form>
        ) : (
          <form action={setAction}>
            <input type="hidden" name="eventId" value={eventId} />
            <Label htmlFor="newPin">New 4-Digit PIN</Label>
            <div className="flex items-center gap-4 mt-2">
              <Input
                id="newPin"
                name="pin"
                type="password"
                maxLength={4}
                required
                className="max-w-xs"
                placeholder="****"
              />
              <SubmitButton>
                <Lock className="mr-2 h-4 w-4" />
                Set PIN
              </SubmitButton>
            </div>
            {setState?.error && <p className="text-sm text-destructive mt-2">{setState.error}</p>}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
