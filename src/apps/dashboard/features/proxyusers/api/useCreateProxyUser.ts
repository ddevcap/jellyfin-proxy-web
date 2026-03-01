import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'utils/query/queryClient';
import { CreateProxyUserRequest } from 'types/proxyUser';
import { QUERY_KEY as PROXY_USERS_QUERY_KEY, toProxyUser } from './useProxyUsers';

export const useCreateProxyUser = () => {
    return useMutation({
        mutationFn: async (request: CreateProxyUserRequest) => {
            const url = window.ApiClient.getUrl('proxy/users');
            /* eslint-disable @typescript-eslint/naming-convention */
            const data = await window.ApiClient.ajax({
                type: 'POST',
                url,
                data: JSON.stringify({
                    username: request.username,
                    display_name: request.displayName,
                    password: request.password,
                    is_admin: request.isAdmin ?? false,
                    direct_stream: request.directStream ?? false
                }),
                contentType: 'application/json',
                dataType: 'json'
            });
            /* eslint-enable @typescript-eslint/naming-convention */
            return toProxyUser(data);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [PROXY_USERS_QUERY_KEY] });
        }
    });
};
