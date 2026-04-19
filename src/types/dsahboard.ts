import { LucideIcon } from "lucide-react";

export type PulseMetric = {
  current: number;
  previous: number;
};

export type PulseDataNode = {
  daily: PulseMetric;
  monthly: PulseMetric;
};

export interface PulseData {
  distributed: PulseDataNode;
  payments: PulseDataNode;
  deliveries: PulseDataNode;
}

export interface SinglePulseCardProps {
  title: string;
  data: PulseDataNode;
  isCurrency: boolean;
  Icon: LucideIcon;
  iconColor: string;
}

export interface PulseCardsProps {
  pulse: PulseData;
}