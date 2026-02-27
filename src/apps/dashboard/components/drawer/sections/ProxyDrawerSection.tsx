import People from '@mui/icons-material/People';
import Storage from '@mui/icons-material/Storage';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import React from 'react';

import ListItemLink from 'components/ListItemLink';
import globalize from 'lib/globalize';

const ProxyDrawerSection = () => {
    if (!__PROXY_MODE__) {
        return null;
    }

    return (
        <List
            aria-labelledby='proxy-subheader'
            subheader={
                <ListSubheader component='div' id='proxy-subheader'>
                    {globalize.translate('HeaderProxyManagement')}
                </ListSubheader>
            }
        >
            <ListItem disablePadding>
                <ListItemLink to='/dashboard/proxyusers'>
                    <ListItemIcon>
                        <People />
                    </ListItemIcon>
                    <ListItemText primary={globalize.translate('HeaderProxyUsers')} />
                </ListItemLink>
            </ListItem>
            <ListItem disablePadding>
                <ListItemLink to='/dashboard/proxybackends'>
                    <ListItemIcon>
                        <Storage />
                    </ListItemIcon>
                    <ListItemText primary={globalize.translate('HeaderProxyBackends')} />
                </ListItemLink>
            </ListItem>
        </List>
    );
};

export default ProxyDrawerSection;

