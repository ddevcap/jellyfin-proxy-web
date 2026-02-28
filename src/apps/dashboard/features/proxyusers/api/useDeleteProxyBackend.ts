import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'utils/query/queryClient';
import { QUERY_KEY as BACKENDS_QUERY_KEY } from './useProxyBackends';

export const useDeleteProxyBackend = () => {
    return useMutation({
        mutationFn: async (backendId: string) => {
            const url = window.ApiClient.getUrl(`proxy/backends/${backendId}`);
            await window.ApiClient.ajax({ type: 'DELETE', url });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [BACKENDS_QUERY_KEY] });
        }
    });
};
