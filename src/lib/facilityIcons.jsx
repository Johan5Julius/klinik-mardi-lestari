import { Activity, Heart, ShieldPlus, Stethoscope, Home, Hospital } from 'lucide-react';

const ICON_MAP = {
  Stethoscope,
  Heart,
  Activity,
  ShieldPlus,
  Home,
  Hospital,
};

export function getFacilityIcon(iconName, size = 40) {
  const Icon = ICON_MAP[iconName] || Hospital;
  return <Icon size={size} />;
}
