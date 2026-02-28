import { useQuery } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import type { ProxyBackend } from 'types/proxyUser';

export const QUERY_KEY = 'ProxyBackends';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toProxyBackend = (raw: any): ProxyBackend => ({
    id: raw.id,
    name: raw.name,
    url: raw.url,
    jellyfinServerId: raw.jellyfin_server_id,
    prefix: raw.prefix,
    enabled: raw.enabled,
    createdAt: raw.created_at
});

const fetchProxyBackends = async () => {
    const url = window.ApiClient.getUrl('proxy/backends');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = await window.ApiClient.getJSON(url);
    return data.map(toProxyBackend);
};

export const useProxyBackends = () => {
    const { api } = useApi();

    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: fetchProxyBackends,
        enabled: !!api && __PROXY_MODE__
    });
};
