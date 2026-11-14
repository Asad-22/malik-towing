import {
  BadgeCheck,
  Car,
  Clock,
  Container,
  DollarSign,
  Headset,
  LifeBuoy,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Route,
  Shield,
  Siren,
  Star,
  Timer,
  Truck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Truck,
  Car,
  Container,
  Wrench,
  Siren,
  Timer,
  Clock,
  Headset,
  BadgeCheck,
  DollarSign,
  Shield,
  LifeBuoy,
  Route,
  Navigation,
  MapPin,
  Phone,
  Star,
  MessageCircle,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Truck;
}
