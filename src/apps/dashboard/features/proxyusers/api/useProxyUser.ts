import { useQuery } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import type { Api } from '@jellyfin/sdk';
import type { AxiosRequestConfig } from 'axios';
import { ProxyUser } from 'types/proxyUser';

export const QUERY_KEY = 'ProxyUser';

const fetchProxyUser = async (
    api: Api,
    userId: string,
    options?: AxiosRequestConfig
) => {
    const response = await api.axiosInstance.get(
        `${api.basePath}/proxy/users/${userId}`,
        {
            ...options,
            headers: {
                ...api.configuration.baseOptions?.headers
            }
        }
    ) as { data: ProxyUser };

    return response.data;
};

export const useProxyUser = (userId?: string) => {
    const { api } = useApi();

    return useQuery({
        queryKey: [QUERY_KEY, userId],
        queryFn: ({ signal }) => fetchProxyUser(api!, userId!, { signal }),
        enabled: !!api && !!userId && __PROXY_MODE__
    });
};



