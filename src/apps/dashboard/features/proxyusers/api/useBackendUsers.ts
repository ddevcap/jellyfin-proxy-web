import { useQuery } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import type { Api } from '@jellyfin/sdk';
import type { AxiosRequestConfig } from 'axios';
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

const fetchBackendUsers = async (
    api: Api,
    backendId: string,
    options?: AxiosRequestConfig
) => {
    const response = await api.axiosInstance.get(
        `${api.basePath}/proxy/backends/${backendId}/users`,
        { ...options, headers: { ...api.configuration.baseOptions?.headers } }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as { data: any[] };

    return response.data.map(toBackendUserMapping);
};

export const useBackendUsers = (backendId?: string) => {
    const { api } = useApi();

    return useQuery({
        queryKey: [QUERY_KEY, backendId],
        queryFn: ({ signal }) => fetchBackendUsers(api!, backendId!, { signal }),
        enabled: !!api && !!backendId && __PROXY_MODE__
    });
};

