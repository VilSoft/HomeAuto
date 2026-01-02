import * as icons from '@/icons/links'

export type Service = {
  id: string;
  name: string;
  description?: string;
  url: string;
  icon: string;        // path under /public
  admin?: boolean;
  internal?: boolean;  // future use
};

export const services: Service[] = [
  {
    id: "pihole",
    name: "Pi-hole",
    description: "DNS & ad blocking",
    url: "http://10.0.0.253/admin/",
    icon: icons.Pihole,
    admin: true
  },
  {
    id: "portainer",
    name: "Portainer",
    description: "Docker management",
    url: "https://server0.home:9443/#!/home",
    icon: icons.Portainer,
    admin: true
  },
  {
    id: "jellyfin",
    name: "Jellyfin",
    description: "Media server",
    url: "http://server0.home:8096",
    icon: icons.Jellyfin,
  },
  {
    id: "kassies",
    name: "Kassies Recipes",
    description: "Family recipes",
    url: "http://server0.home:3000",
    icon: icons.Kassiesrecipies,
  },
];
