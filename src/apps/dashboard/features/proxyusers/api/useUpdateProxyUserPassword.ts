import { useMutation } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { UpdateProxyUserPasswordRequest } from 'types/proxyUser';

interface UpdatePasswordParams {
    userId: string;
    data: UpdateProxyUserPasswordRequest;
}

export const useUpdateProxyUserPassword = () => {
    const { api } = useApi();

    return useMutation({
        mutationFn: async ({ userId, data }: UpdatePasswordParams) => {
            await api!.axiosInstance.put(
                `${api!.basePath}/proxy/users/${userId}/password`,
                data,
                {
                    headers: {
                        ...api!.configuration.baseOptions?.headers
                    }
                }
            );
        }
    });
};

