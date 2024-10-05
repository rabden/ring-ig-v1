export const aspectRatios = {
  "1:1": { width: 1024, height: 1024 },
  "4:3": { width: 1024, height: 768 },
  "3:4": { width: 768, height: 1024 },
  "16:9": { width: 1024, height: 576 },
  "9:16": { width: 576, height: 1024 },
  "3:2": { width: 1024, height: 683 },
  "2:3": { width: 683, height: 1024 },
  "5:4": { width: 1024, height: 819 },
  "4:5": { width: 819, height: 1024 },
  "21:9": { width: 1024, height: 439 },
  "9:21": { width: 439, height: 1024 },
  "1.91:1": { width: 1024, height: 536 },
  "1:1.91": { width: 536, height: 1024 },
  "1:2": { width: 512, height: 1024 },
  "2:1": { width: 1024, height: 512 },
}

export const qualityOptions = {
  "SD": 512,
  "HD": 1024,
  "HD+": 1536,
  "4K": 2048,
}

// Import modelConfigs from the correct location
import { modelConfigs } from '@/utils/modelConfigs'

// Re-export modelConfigs
export { modelConfigs }