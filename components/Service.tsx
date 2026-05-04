import * as icons from '@/icons/links'

export type ServiceAction = {
  type: 'api-key-prompt';
  endpoint: string;
  method: string;
};

export type Service = {
  id: string;
  name: string;
  description?: string;
  url: string;
  icon: string;        // path under /public
  admin?: boolean;
  internal?: boolean;  // future use
  action?: ServiceAction;
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
    url: "http://portainer.server0.home/",
    icon: icons.Portainer,
    admin: true
  },
    {
    id: "jellyfin-backup",
    name: "Jellyfin Backup",
    description: "Trigger media backup",
    url: "",
    icon: icons.Jellyfin,
    admin: true,
    action: {
      type: 'api-key-prompt',
      endpoint: 'https://server0.home/jellyfin-backup/backup',
      method: 'POST',
    }
  },
  {
    id: "jellyfin",
    name: "Jellyfin",
    description: "Media server",
    url: "http://jellyfin.server0.home",
    icon: icons.Jellyfin,
  },
  {
    id: "kassies",
    name: "Kassies Recipes",
    description: "Family recipes",
    url: "http://recipes.server0.home",
    icon: icons.Kassiesrecipies,
  },
    {
    id: "kassies",
    name: "Kassies Crochet",
    description: "Crochet patterns",
    url: "http://crochet.server0.home",
    icon: icons.Kassiescrochet,
  },
];
