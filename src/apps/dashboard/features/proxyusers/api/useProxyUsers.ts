import { useQuery } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { ProxyUser } from 'types/proxyUser';

export const QUERY_KEY = 'ProxyUsers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toProxyUser = (raw: any): ProxyUser => ({
    id: raw.id,
    username: raw.username,
    displayName: raw.display_name,
    isAdmin: raw.is_admin,
    directStream: raw.direct_stream ?? false,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at
});

const fetchProxyUsers = async () => {
    const url = window.ApiClient.getUrl('proxy/users');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = await window.ApiClient.getJSON(url);
    return data.map(toProxyUser);
};

export const useProxyUsers = () => {
    const { api } = useApi();

    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: fetchProxyUsers,
        enabled: !!api && __PROXY_MODE__
    });
};

export { toProxyUser };
