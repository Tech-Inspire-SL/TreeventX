'use client';

import { useActionState, useFormStatus } from 'react-dom';
import { createPinSessionAction } from '@/lib/actions/event-security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { LockKeyhole } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Verifying...' : 'Unlock'}
    </Button>
  );
}

export function PinVerificationForm({ eventId, eventTitle }: { eventId: number, eventTitle: string }) {
  const actionWithId = createPinSessionAction.bind(null, eventId);
  const [state, dispatch] = useActionState(actionWithId, null);

  useEffect(() => {
    if (state?.success) {
      // Refresh the page to have the server re-evaluate the cookie
      window.location.reload();
    }
  }, [state]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>PIN Required</CardTitle>
          <CardDescription>
            Please enter the PIN for "{eventTitle}" to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div>
              <Label htmlFor="pin" className="sr-only">PIN</Label>
              <Input
                id="pin"
                name="pin"
                type="password"
                required
                maxLength={4}
                placeholder="****"
                className="text-center text-lg tracking-[0.5em]"
              />
            </div>
            {state?.error && (
              <p className="text-sm text-center text-destructive">{state.error}</p>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
