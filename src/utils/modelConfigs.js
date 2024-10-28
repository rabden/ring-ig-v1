export const modelConfigs = {
  flux: {
    name: "Ring.1",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    inferenceSteps: [4, 8, 12, 16, 20],
    defaultStep: 8
  },
  fluxDev: {
    name: "Ring.1 hyper",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 30
  },
  animeNsfw: {
    name: "Ring.1Nanime",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/John6666/rdxl-anime-sdxlpony7-sdxl",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 30
  },
  nsfwMaster: {
    name: "Ring.1N",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/pimpilikipilapi1/NSFW_master",
    inferenceSteps: [30, 35, 40, 45, 50],
    defaultStep: 35
  }
};