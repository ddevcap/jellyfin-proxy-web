import { useMutation } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { queryClient } from 'utils/query/queryClient';
import { QUERY_KEY as BACKEND_USERS_QUERY_KEY } from './useBackendUsers';

interface DeleteBackendUserParams {
    backendId: string;
    mappingId: string;
}

export const useDeleteBackendUser = () => {
    const { api } = useApi();

    return useMutation({
        mutationFn: async ({ backendId, mappingId }: DeleteBackendUserParams) => {
            await api!.axiosInstance.delete(
                `${api!.basePath}/proxy/backends/${backendId}/users/${mappingId}`,
                { headers: { ...api!.configuration.baseOptions?.headers } }
            );
        },
        onSuccess: (_, { backendId }) => {
            void queryClient.invalidateQueries({ queryKey: [BACKEND_USERS_QUERY_KEY, backendId] });
        }
    });
};

