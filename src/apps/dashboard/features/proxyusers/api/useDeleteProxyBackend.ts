import { useMutation } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { queryClient } from 'utils/query/queryClient';
import { QUERY_KEY as BACKENDS_QUERY_KEY } from './useProxyBackends';

export const useDeleteProxyBackend = () => {
    const { api } = useApi();

    return useMutation({
        mutationFn: async (backendId: string) => {
            await api!.axiosInstance.delete(
                `${api!.basePath}/proxy/backends/${backendId}`,
                { headers: { ...api!.configuration.baseOptions?.headers } }
            );
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [BACKENDS_QUERY_KEY] });
        }
    });
};

