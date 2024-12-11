import { useQuery } from '@tanstack/react-query';
import { styleConfig } from '@/config/styleConfig';

export const useStyleConfigs = () => {
  return useQuery({
    queryKey: ['styleConfigs'],
    queryFn: () => styleConfig,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};