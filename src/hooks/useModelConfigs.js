import { modelConfig } from '../config/modelConfig';

export const useModelConfigs = () => {
  return {
    data: modelConfig,
    isLoading: false
  };
};