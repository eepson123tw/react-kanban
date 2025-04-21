import type { NavMenu, NavMenuItems } from '~/types/nav'

export const navMenu: NavMenu[] = [
  {
    heading: 'General',
    items: [
      {
        title: 'Dashboard',
        icon: 'i-lucide-home',
        link: '/',
      },
    ],
  },
  {
    heading: 'Collaboration',
    items: [
      {
        title: 'Tiptap',
        icon: 'i-lucide-edit',
        link: '/CollaborativeEditor',
      },
    ],
  },
  {
    heading: 'Gantt',
    items: [
      {
        title: 'Gantt-jsgantt-improved',
        icon: 'i-lucide-chart-area',
        link: '/Gantt',
      },
      {
        title: 'Gantt-dhtmlx-gantt',
        icon: 'i-lucide-chart-area',
        link: '/Gantt2',
      },
    ],
  },
  {
    heading: 'Pages',
    items: [
      {
        title: 'TestCase',
        icon: 'i-lucide-lock-keyhole-open',
        children: [
          {
            title: 'Kanban',
            icon: 'i-lucide-circle',
            link: '/Kanban',
          },
        ],
      },
    ],
  },
]

export const navMenuBottom: NavMenuItems = [
  {
    title: 'Help & Support',
    icon: 'i-lucide-circle-help',
    link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  },
  {
    title: 'Feedback',
    icon: 'i-lucide-send',
    link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  },
]
