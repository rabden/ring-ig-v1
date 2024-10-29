export const modelConfigs = {
  turbo: {
    name: "Ring.1 turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large-turbo",
    inferenceSteps: [4],
    defaultStep: 4,
    qualityLimits: ["SD", "HD"]
  },
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
  preLar: {
    name: "Ring.1 Pre-lar",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    inferenceSteps: [50],
    defaultStep: 50,
    qualityLimits: ["SD", "HD"]
  },
  animeNsfw: {
    name: "Ring.1 Anime",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/John6666/mala-anime-mix-nsfw-pony-xl-v5new-sdxl-spo",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 30
  },
  nsfwMaster: {
    name: "Ring.1N",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/pimpilikipilapi1/NSFW_master",
    inferenceSteps: [30, 35, 40, 45, 50],
    defaultStep: 35
  },
  nsfwPro: {
    name: "Ring.1Npro",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/xey/sldr_flux_nsfw_v2-studio",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 30
  }
};