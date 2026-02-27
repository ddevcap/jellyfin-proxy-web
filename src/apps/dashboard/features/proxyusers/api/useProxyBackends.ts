import { useQuery } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import type { Api } from '@jellyfin/sdk';
import type { AxiosRequestConfig } from 'axios';
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

const fetchProxyBackends = async (api: Api, options?: AxiosRequestConfig) => {
    const response = await api.axiosInstance.get(
        `${api.basePath}/proxy/backends`,
        { ...options, headers: { ...api.configuration.baseOptions?.headers } }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as { data: any[] };

    return response.data.map(toProxyBackend);
};

export const useProxyBackends = () => {
    const { api } = useApi();

    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: ({ signal }) => fetchProxyBackends(api!, { signal }),
        enabled: !!api && __PROXY_MODE__
    });
};

