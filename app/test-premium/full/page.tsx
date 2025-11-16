import {
	MapPin,
	Image as ImageIcon,
	MessageSquare,
	ArrowRight,
	Bell,
	Clock,
} from 'lucide-react';

import { mockEvent, mockTemplates, createDefaultCommunityFeatures } from '../mock-data';
import { calculateCountdownSnapshot } from '@/lib/premium/countdown';
import { Badge } from '@/components/ui/badge';
import { PremiumHubContent } from '@/components/premium/premium-hub-content';

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

export default function FullPremiumPreviewPage() {
	const template = mockEvent.template ?? mockTemplates[1];
	const countdown = calculateCountdownSnapshot(mockEvent.date);
	const communityFeatures = createDefaultCommunityFeatures();

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
			<div className="container mx-auto px-4 py-12 lg:px-8">
				<div className="mb-10 text-center">
								<Badge className="bg-primary/10 text-primary capitalize">
									{template.template_type}
					</Badge>
					<h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
						{mockEvent.title}
					</h1>
					<p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
						{mockEvent.description}
					</p>
				</div>

				<PremiumHubContent
					event={{ ...mockEvent, template }}
					countdown={countdown}
					communityFeatures={communityFeatures}
					layout="page"
					heroHeading="Welcome to HackHub 2025"
					heroDescription="Join our vibrant community for an exciting hackathon. Connect with innovators, share your journey, and be part of something extraordinary."
					heroActions={heroActions}
					stats={statHighlights}
					infoCards={eventInformation}
					ctaSection={ctaSection}
				/>
			</div>
		</div>
	);
}
