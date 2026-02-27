import { useMutation } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { queryClient } from 'utils/query/queryClient';
import { UpdateProxyUserRequest } from 'types/proxyUser';
import { QUERY_KEY } from './useProxyUser';
import { QUERY_KEY as PROXY_USERS_QUERY_KEY, toProxyUser } from './useProxyUsers';

interface UpdateProxyUserParams {
    userId: string;
    data: UpdateProxyUserRequest;
}

export const useUpdateProxyUser = () => {
    const { api } = useApi();

    return useMutation({
        mutationFn: async ({ userId, data }: UpdateProxyUserParams) => {
            // Build a snake_case payload, only including defined fields
            const payload: Record<string, unknown> = {};
            if (data.displayName !== undefined) payload['display_name'] = data.displayName;
            if (data.isAdmin !== undefined) payload['is_admin'] = data.isAdmin;

            const response = await api!.axiosInstance.patch(
                `${api!.basePath}/proxy/users/${userId}`,
                payload,
                { headers: { ...api!.configuration.baseOptions?.headers } }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as { data: any };

            return toProxyUser(response.data);
        },
        onSuccess: (_, { userId }) => {
            void queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] });
            void queryClient.invalidateQueries({ queryKey: [PROXY_USERS_QUERY_KEY] });
        }
    });
};
