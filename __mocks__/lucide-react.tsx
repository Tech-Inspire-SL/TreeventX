import React from 'react';

const createIcon = (name: string) =>
  React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
    <svg ref={ref} data-icon={name} {...props} />
  ));

export const ArrowRight = createIcon('ArrowRight');
export const Bell = createIcon('Bell');
export const Calendar = createIcon('Calendar');
export const Clock = createIcon('Clock');
export const ImageIcon = createIcon('Image');
export const MapPin = createIcon('MapPin');
export const MessageSquare = createIcon('MessageSquare');
export const Users = createIcon('Users');

export type LucideIcon = ReturnType<typeof createIcon>;

const defaultExport = {
  ArrowRight,
  Bell,
  Calendar,
  Clock,
  ImageIcon,
  MapPin,
  MessageSquare,
  Users,
};

export default defaultExport;
