'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Crown, 
  Sparkles, 
  Building2,
  MapPin,
  Image as ImageIcon,
  MessageSquare,
  Star,
  FileText,
  Mail,
  Settings,
  Eye,
  Clock,
  Bell,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import type { CountdownState, EventTemplate } from '@/lib/types/premium';
import { mockTemplates, mockEvent, createDefaultCommunityFeatures } from './mock-data';
import { calculateCountdown } from '@/lib/premium/countdown';
import { PremiumHubContent } from '@/components/premium/premium-hub-content';

export default function PremiumTestPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate>(
    mockEvent.template ?? mockTemplates[1]
  );
  const [communityFeatures, setCommunityFeatures] = useState(() => createDefaultCommunityFeatures());

  const getTemplateIcon = (template_type: string) => {
    switch (template_type) {
      case 'basic':
        return <Eye className="h-5 w-5" />;
      case 'premium':
        return <Crown className="h-5 w-5" />;
      case 'community_hub':
        return <Building2 className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getPriceTierColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'bg-green-100 text-green-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleFeature = (featureType: string) => {
    setCommunityFeatures(features => 
      features.map(feature => 
        feature.feature_type === featureType 
          ? { ...feature, is_enabled: !feature.is_enabled }
          : feature
      )
    );
  };

  const testEvent = {
    ...mockEvent,
    template: selectedTemplate,
    template_id: selectedTemplate.id,
    community_features: communityFeatures,
    gallery: [],
    timeline: [],
    comments: [],
    feedback: [],
    resources: [],
    newsletter_subscribers: []
  };

  const [countdown, setCountdown] = useState<CountdownState>(() => calculateCountdown(mockEvent.date));

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(calculateCountdown(testEvent.date));
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 60000);

    return () => clearInterval(intervalId);
  }, [testEvent.date]);

  const eventInformation = [
    {
      title: 'Reminders',
      description: "Set reminders for events you don't want to miss",
      icon: Bell,
    },
    {
      title: 'Locations',
      description: 'All events are held at the main venue unless specified',
      icon: MapPin,
    },
    {
      title: 'Schedule',
      description: 'Schedule is subject to change. Check back for updates',
      icon: Clock,
    },
  ];

  const heroActions = [
    {
      label: 'Join Now',
      href: '#',
      icon: ArrowRight,
      iconPosition: 'right' as const,
    },
    {
      label: 'Sign In',
      href: '/login',
      variant: 'outline' as const,
    },
  ];

  const statHighlights = [
    { label: 'Total Participants', value: '500+' },
    { label: 'Reviews', value: '2,400+' },
  ];

  const ctaSection = {
    title: 'Ready to Get Started?',
    description:
      'Upload your photos, explore the timeline, connect with other participants, and follow the hackathon journey.',
    actions: [
      {
        label: 'Explore Gallery',
        href: '/events/999/gallery',
        icon: ImageIcon,
      },
      {
        label: 'Contact Organisers',
        href: '/events/999/contact',
        icon: MessageSquare,
        variant: 'outline' as const,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Premium Event Templates
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test and explore TreeventX's premium event page features. Choose a template, customize features, and see the magic happen!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Choose Template
                </CardTitle>
                <CardDescription>
                  Select a premium template to test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-md ${
                        selectedTemplate.id === template.id ? 'bg-primary text-white' : 'bg-muted'
                      }`}>
                        {getTemplateIcon(template.template_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{template.name}</h3>
                          <Badge className={getPriceTierColor(template.price_tier)}>
                            {template.price_tier}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Feature Toggles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Community Features
                </CardTitle>
                <CardDescription>
                  Toggle features to see them in action
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {communityFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {feature.feature_type === 'gallery' && <ImageIcon className="h-4 w-4" />}
                      {feature.feature_type === 'timeline' && <Clock className="h-4 w-4" />}
                      {feature.feature_type === 'comments' && <MessageSquare className="h-4 w-4" />}
                      {feature.feature_type === 'feedback' && <Star className="h-4 w-4" />}
                      {feature.feature_type === 'resources' && <FileText className="h-4 w-4" />}
                      {feature.feature_type === 'newsletter' && <Mail className="h-4 w-4" />}
                      <span className="text-sm font-medium capitalize">
                        {feature.feature_type}
                      </span>
                    </div>
                    <Switch
                      checked={feature.is_enabled}
                      onCheckedChange={() => toggleFeature(feature.feature_type)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your premium event page will look
                </CardDescription>
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm">
                    <Link href="/test-premium/full" target="_blank">
                      Open Full Preview
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/events/create">
                      Create Premium Event
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <PremiumHubContent
                  event={testEvent}
                  countdown={countdown}
                  communityFeatures={communityFeatures}
                  layout="embedded"
                  heroHeading="Welcome to HackHub 2025"
                  heroDescription="Join our vibrant community for an exciting hackathon. Connect with innovators, share your journey, and be part of something extraordinary."
                  heroActions={heroActions}
                  stats={statHighlights}
                  infoCards={eventInformation}
                  ctaSection={ctaSection}
                />
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}