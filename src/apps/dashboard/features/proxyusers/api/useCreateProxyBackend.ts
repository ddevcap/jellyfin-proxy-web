import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'utils/query/queryClient';
import type { CreateProxyBackendRequest } from 'types/proxyUser';
import { QUERY_KEY as BACKENDS_QUERY_KEY, toProxyBackend } from './useProxyBackends';

export const useCreateProxyBackend = () => {
    return useMutation({
        mutationFn: async (request: CreateProxyBackendRequest) => {
            const url = window.ApiClient.getUrl('proxy/backends');
            const data = await window.ApiClient.ajax({
                type: 'POST',
                url,
                data: JSON.stringify({
                    name: request.name,
                    url: request.url
                }),
                contentType: 'application/json',
                dataType: 'json'
            });
            return toProxyBackend(data);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [BACKENDS_QUERY_KEY] });
        }
    });
};
