import { useMutation } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { queryClient } from 'utils/query/queryClient';
import type { UpdateProxyBackendRequest } from 'types/proxyUser';
import { QUERY_KEY as BACKENDS_QUERY_KEY, toProxyBackend } from './useProxyBackends';

interface UpdateProxyBackendParams {
    backendId: string;
    data: UpdateProxyBackendRequest;
}

export const useUpdateProxyBackend = () => {
    const { api } = useApi();

    return useMutation({
        mutationFn: async ({ backendId, data }: UpdateProxyBackendParams) => {
            const payload: Record<string, unknown> = {};
            if (data.name !== undefined) payload['name'] = data.name;
            if (data.url !== undefined) payload['url'] = data.url;
            if (data.enabled !== undefined) payload['enabled'] = data.enabled;

            const response = await api!.axiosInstance.patch(
                `${api!.basePath}/proxy/backends/${backendId}`,
                payload,
                { headers: { ...api!.configuration.baseOptions?.headers } }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as { data: any };

            return toProxyBackend(response.data);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [BACKENDS_QUERY_KEY] });
        }
    });
};

