import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import React, { FC } from 'react';

import DrawerHeaderLink from 'apps/experimental/components/drawers/DrawerHeaderLink';
import ResponsiveDrawer, { ResponsiveDrawerProps } from 'components/ResponsiveDrawer';

import ServerDrawerSection from './sections/ServerDrawerSection';
import ProxyDrawerSection from './sections/ProxyDrawerSection';
import DevicesDrawerSection from './sections/DevicesDrawerSection';
import LiveTvDrawerSection from './sections/LiveTvDrawerSection';
import AdvancedDrawerSection from './sections/AdvancedDrawerSection';
import PluginDrawerSection from './sections/PluginDrawerSection';

const AppDrawer: FC<ResponsiveDrawerProps> = ({
    open = false,
    onClose,
    onOpen
}) => (
    <ResponsiveDrawer
        open={open}
        onClose={onClose}
        onOpen={onOpen}
    >
        <List disablePadding>
            <ListItem disablePadding>
                <DrawerHeaderLink />
            </ListItem>
        </List>
        {!__PROXY_MODE__ && (
            <>
                <ServerDrawerSection />
                <DevicesDrawerSection />
                <LiveTvDrawerSection />
                <PluginDrawerSection />
                <AdvancedDrawerSection />
            </>
        )}
        <ProxyDrawerSection />
    </ResponsiveDrawer>
);

export default AppDrawer;
