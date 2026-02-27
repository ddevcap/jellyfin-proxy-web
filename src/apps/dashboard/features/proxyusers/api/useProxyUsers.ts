import { useQuery } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import type { Api } from '@jellyfin/sdk';
import type { AxiosRequestConfig } from 'axios';
import { ProxyUser } from 'types/proxyUser';

export const QUERY_KEY = 'ProxyUsers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toProxyUser = (raw: any): ProxyUser => ({
    id: raw.id,
    username: raw.username,
    displayName: raw.display_name,
    isAdmin: raw.is_admin,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at
});

const fetchProxyUsers = async (api: Api, options?: AxiosRequestConfig) => {
    const response = await api.axiosInstance.get(
        `${api.basePath}/proxy/users`,
        {
            ...options,
            headers: { ...api.configuration.baseOptions?.headers }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as { data: any[] };

    return response.data.map(toProxyUser);
};

export const useProxyUsers = () => {
    const { api } = useApi();

    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: ({ signal }) => fetchProxyUsers(api!, { signal }),
        enabled: !!api && __PROXY_MODE__
    });
};

export { toProxyUser };
