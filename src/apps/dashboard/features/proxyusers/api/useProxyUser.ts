import { useQuery } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { ProxyUser } from 'types/proxyUser';

export const QUERY_KEY = 'ProxyUser';

const fetchProxyUser = async (userId: string) => {
    const url = window.ApiClient.getUrl(`proxy/users/${userId}`);
    const data: ProxyUser = await window.ApiClient.getJSON(url);
    return data;
};

export const useProxyUser = (userId?: string) => {
    const { api } = useApi();

    return useQuery({
        queryKey: [QUERY_KEY, userId],
        queryFn: () => fetchProxyUser(userId!),
        enabled: !!api && !!userId && __PROXY_MODE__
    });
};
