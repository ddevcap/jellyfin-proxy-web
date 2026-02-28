import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'utils/query/queryClient';
import type { UpdateProxyBackendRequest } from 'types/proxyUser';
import { QUERY_KEY as BACKENDS_QUERY_KEY, toProxyBackend } from './useProxyBackends';

interface UpdateProxyBackendParams {
    backendId: string;
    data: UpdateProxyBackendRequest;
}

export const useUpdateProxyBackend = () => {
    return useMutation({
        mutationFn: async ({ backendId, data }: UpdateProxyBackendParams) => {
            const payload: Record<string, unknown> = {};
            if (data.name !== undefined) payload['name'] = data.name;
            if (data.url !== undefined) payload['url'] = data.url;
            if (data.enabled !== undefined) payload['enabled'] = data.enabled;

            const url = window.ApiClient.getUrl(`proxy/backends/${backendId}`);
            const result = await window.ApiClient.ajax({
                type: 'PATCH',
                url,
                data: JSON.stringify(payload),
                contentType: 'application/json',
                dataType: 'json'
            });
            return toProxyBackend(result);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [BACKENDS_QUERY_KEY] });
        }
    });
};
