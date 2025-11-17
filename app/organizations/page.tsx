'use client';

import { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Building2, Search, MapPin, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '../lib/supabase/client';

type Organization = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  location: string | null;
  is_verified: boolean;
  follower_count: number;
  event_count: number;
};

type RelationCount = Array<{ count: number | null }> | { count: number | null } | null | undefined;

const hasCountProperty = (value: unknown): value is { count: number | null } =>
  typeof value === 'object' && value !== null && 'count' in value;

const getRelationCount = (relation: RelationCount) => {
  if (!relation) return 0;
  if (Array.isArray(relation)) {
    return relation[0]?.count ?? 0;
  }
  if (hasCountProperty(relation)) {
    return relation.count ?? 0;
  }
  return 0;
};

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          followers:followers(count),
          events:events(count)
        `)
        .ilike('name', `%${searchQuery}%`)
        .order('name')
        .limit(20);

      if (error) {
        console.error('Error fetching organizations:', error);
        setLoading(false);
        return;
      }

      const normalized: Organization[] = (data || []).map((org) => ({
        id: org.id,
        name: org.name,
        description: org.description,
        logo_url: org.logo_url,
        location: org.location,
        is_verified: org.is_verified,
        follower_count: getRelationCount(org.followers as RelationCount),
        event_count: getRelationCount(org.events as RelationCount),
      }));

      setOrganizations(normalized);
      setLoading(false);
    };

    fetchOrganizations();
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">
            Discover and follow event organizers
          </p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search organizations..."
              className="pl-10 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-[150px] bg-muted rounded" />
                    <div className="h-3 w-[100px] bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Link key={org.id} href={`/organizations/${org.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      {org.logo_url ? (
                        <AvatarImage src={org.logo_url} alt={org.name} />
                      ) : (
                        <AvatarFallback>
                          <Building2 className="h-6 w-6" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{org.name}</h3>
                        {org.is_verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Verified
                          </span>
                        )}
                      </div>
                      {org.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {org.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {org.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{org.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{org.follower_count} followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{org.event_count} events</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!loading && organizations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No organizations found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or create your own organization
          </p>
        </div>
      )}
    </div>
  );
}
