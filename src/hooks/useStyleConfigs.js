import { useMemo } from 'react';
import { styleConfig } from '../config/styleConfig';

export const useStyleConfigs = () => {
  const data = useMemo(() => styleConfig, []);
  return {
    data,
    isLoading: false
  };
};