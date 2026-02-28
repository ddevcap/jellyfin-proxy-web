import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'utils/query/queryClient';
import { QUERY_KEY as BACKEND_USERS_QUERY_KEY } from './useBackendUsers';

interface DeleteBackendUserParams {
    backendId: string;
    mappingId: string;
}

export const useDeleteBackendUser = () => {
    return useMutation({
        mutationFn: async ({ backendId, mappingId }: DeleteBackendUserParams) => {
            const url = window.ApiClient.getUrl(`proxy/backends/${backendId}/users/${mappingId}`);
            await window.ApiClient.ajax({ type: 'DELETE', url });
        },
        onSuccess: (_, { backendId }) => {
            void queryClient.invalidateQueries({ queryKey: [BACKEND_USERS_QUERY_KEY, backendId] });
        }
    });
};
