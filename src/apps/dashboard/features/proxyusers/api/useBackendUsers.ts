import { useQuery } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import type { BackendUserMapping } from 'types/proxyUser';

export const QUERY_KEY = 'BackendUsers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toBackendUserMapping = (raw: any): BackendUserMapping => ({
    id: raw.id,
    userId: raw.user_id,
    username: raw.username,
    backendId: raw.backend_id,
    backendUserId: raw.backend_user_id,
    enabled: raw.enabled
});

const fetchBackendUsers = async (backendId: string) => {
    const url = window.ApiClient.getUrl(`proxy/backends/${backendId}/users`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = await window.ApiClient.getJSON(url);
    return data.map(toBackendUserMapping);
};

export const useBackendUsers = (backendId?: string) => {
    const { api } = useApi();

    return useQuery({
        queryKey: [QUERY_KEY, backendId],
        queryFn: () => fetchBackendUsers(backendId!),
        enabled: !!api && !!backendId && __PROXY_MODE__
    });
};
