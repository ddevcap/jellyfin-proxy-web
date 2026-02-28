import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'utils/query/queryClient';
import type { LoginToBackendRequest } from 'types/proxyUser';
import { QUERY_KEY as BACKEND_USERS_QUERY_KEY, toBackendUserMapping } from './useBackendUsers';

interface LoginToBackendParams {
    backendId: string;
    data: LoginToBackendRequest;
}

export const useLoginToBackend = () => {
    return useMutation({
        mutationFn: async ({ backendId, data }: LoginToBackendParams) => {
            const url = window.ApiClient.getUrl(`proxy/backends/${backendId}/login`);
            /* eslint-disable @typescript-eslint/naming-convention */
            const result = await window.ApiClient.ajax({
                type: 'POST',
                url,
                data: JSON.stringify({
                    proxy_user_id: data.proxyUserId,
                    username: data.username,
                    password: data.password
                }),
                contentType: 'application/json',
                dataType: 'json'
            });
            /* eslint-enable @typescript-eslint/naming-convention */
            return toBackendUserMapping(result);
        },
        onSuccess: (_, { backendId }) => {
            void queryClient.invalidateQueries({ queryKey: [BACKEND_USERS_QUERY_KEY, backendId] });
        }
    });
};
