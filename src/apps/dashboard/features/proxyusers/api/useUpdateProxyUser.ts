import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'utils/query/queryClient';
import { UpdateProxyUserRequest } from 'types/proxyUser';
import { QUERY_KEY } from './useProxyUser';
import { QUERY_KEY as PROXY_USERS_QUERY_KEY, toProxyUser } from './useProxyUsers';

interface UpdateProxyUserParams {
    userId: string;
    data: UpdateProxyUserRequest;
}

export const useUpdateProxyUser = () => {
    return useMutation({
        mutationFn: async ({ userId, data }: UpdateProxyUserParams) => {
            const payload: Record<string, unknown> = {};
            if (data.displayName !== undefined) payload['display_name'] = data.displayName;
            if (data.isAdmin !== undefined) payload['is_admin'] = data.isAdmin;

            const url = window.ApiClient.getUrl(`proxy/users/${userId}`);
            const result = await window.ApiClient.ajax({
                type: 'PATCH',
                url,
                data: JSON.stringify(payload),
                contentType: 'application/json',
                dataType: 'json'
            });
            return toProxyUser(result);
        },
        onSuccess: (_, { userId }) => {
            void queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] });
            void queryClient.invalidateQueries({ queryKey: [PROXY_USERS_QUERY_KEY] });
        }
    });
};
