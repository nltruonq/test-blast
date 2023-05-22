// assets
import { IconBrandChrome, IconHelp, IconUserCircle, IconPackage, IconPrompt, IconMailbox } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp, IconUserCircle, IconPackage, IconPrompt, IconMailbox };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'user',
            title: 'Users',
            type: 'item',
            url: '/user',
            icon: icons.IconUserCircle,
            breadcrumbs: false
        },
        {
            id: 'package',
            title: 'Packages',
            type: 'item',
            url: '/package',
            icon: icons.IconPackage,
            breadcrumbs: false
        },
        {
            id: 'prompt',
            title: 'Prompts',
            type: 'item',
            url: '/prompt',
            icon: icons.IconPrompt,
            breadcrumbs: false
        },
        {
            id: 'mail',
            title: 'Mails',
            type: 'item',
            url: '/mail',
            icon: icons.IconMailbox,
            breadcrumbs: false
        }
        // ,
        // {
        //     id: 'documentation',
        //     title: 'Documentation',
        //     type: 'item',
        //     url: 'https://codedthemes.gitbook.io/berry/',
        //     icon: icons.IconHelp,
        //     external: true,
        //     target: true
        // }
    ]
};

export default other;
