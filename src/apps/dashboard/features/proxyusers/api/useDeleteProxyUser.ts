import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'utils/query/queryClient';
import { QUERY_KEY as PROXY_USERS_QUERY_KEY } from './useProxyUsers';

export const useDeleteProxyUser = () => {
    return useMutation({
        mutationFn: async (userId: string) => {
            const url = window.ApiClient.getUrl(`proxy/users/${userId}`);
            await window.ApiClient.ajax({ type: 'DELETE', url });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [PROXY_USERS_QUERY_KEY] });
        }
    });
};
