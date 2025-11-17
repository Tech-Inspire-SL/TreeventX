'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { createOrganizationAction, updateOrganizationAction } from '../app/lib/actions/organizations';
import type { Organization } from '../app/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Building2, UploadCloud } from 'lucide-react';

const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(100),
  description: z.string().max(500).optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().max(200).optional(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
  organization?: Organization;
}

export function OrganizationForm({ organization }: OrganizationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(organization?.logo_url ?? null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || '',
      description: organization?.description || '',
      website: organization?.website || '',
      location: organization?.location || '',
    },
  });

  async function onSubmit(data: OrganizationFormValues) {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('website', data.website || '');
    formData.append('location', data.location || '');
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      const result = organization
        ? await updateOrganizationAction(organization.id, formData)
        : await createOrganizationAction(formData);

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setIsSubmitting(false);
      } else if (organization && 'success' in result && result.success) {
        toast({
          title: 'Success',
          description: 'Organization updated successfully.',
        });
        setIsSubmitting(false);
        router.refresh();
      }
      // For create, redirect happens in action
    } catch (_error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview((current) => {
      if (current && current.startsWith('blob:')) {
        URL.revokeObjectURL(current);
      }
      return previewUrl;
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Events Co." {...field} />
              </FormControl>
              <FormDescription>
                This name will be visible on all events created by this organization.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell people about your organization..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="City, Country"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Where is your organization based?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Organization Logo (Optional)</label>
          <div className="flex flex-col gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={isSubmitting}
            />
            {(logoPreview || organization?.logo_url) && (
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  {logoPreview ? (
                    <AvatarImage src={logoPreview} alt="Organization logo preview" />
                  ) : organization?.logo_url ? (
                    <AvatarImage src={organization.logo_url} alt={organization.name} />
                  ) : (
                    <AvatarFallback>
                      <Building2 className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className="text-sm text-muted-foreground">
                  Uploaded logos will appear on your organization profile and event hub.
                </p>
              </div>
            )}
          </div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <UploadCloud className="h-4 w-4" />
            PNG, JPG, or WEBP files up to 2MB.
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : organization ? 'Update Organization' : 'Create Organization'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}