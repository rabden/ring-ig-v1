import { styleConfig } from '../config/styleConfig';

export const useStyleConfigs = () => {
  return {
    data: styleConfig,
    isLoading: false
  };
};