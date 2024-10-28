export const aspectRatios = {
  "9:21": { width: 439, height: 1024 },
  "9:19": { width: 486, height: 1024 },  // New
  "9:16": { width: 576, height: 1024 },
  "2:3": { width: 683, height: 1024 },
  "3:4": { width: 768, height: 1024 },
  "4:5": { width: 819, height: 1024 },
  "1:1": { width: 1024, height: 1024 },
  "5:4": { width: 1024, height: 819 },
  "4:3": { width: 1024, height: 768 },
  "3:2": { width: 1024, height: 683 },
  "16:9": { width: 1024, height: 576 },
  "19:9": { width: 1024, height: 486 },  // New
  "2:1": { width: 1024, height: 512 },   // New
  "20:9": { width: 1024, height: 461 },  // New
  "21:9": { width: 1024, height: 439 },
  "1.91:1": { width: 1024, height: 536 },
  "1:1.91": { width: 536, height: 1024 },
  "1:2": { width: 512, height: 1024 },
  "2:1": { width: 1024, height: 512 },
}

export const qualityOptions = {
  "SD": 512,
  "HD": 1024,
  "HD+": 1536,
}

// Import modelConfigs from the correct location
import { modelConfigs } from '@/utils/modelConfigs'

// Re-export modelConfigs
export { modelConfigs }