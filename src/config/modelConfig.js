export const modelConfig = {
  turbo: {
    name: "Ring.1 turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large-turbo",
    inferenceSteps: [4],
    defaultStep: 4,
    qualityLimits: ["SD", "HD"],
    noStyleSuffix: false,
    isPremium: false,
    promptSuffix: null
  },
  flux: {
    name: "Ring.1",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    inferenceSteps: [4, 8, 12, 16, 20],
    defaultStep: 8,
    qualityLimits: null,
    noStyleSuffix: false,
    isPremium: false,
    promptSuffix: null
  },
  fluxDev: {
    name: "Ring.1 hyper",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    inferenceSteps: [30, 35, 40],
    defaultStep: 35,
    qualityLimits: null,
    noStyleSuffix: false,
    isPremium: true,
    promptSuffix: null
  },
  preLar: {
    name: "Ring.1 Pre-lar",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    inferenceSteps: [30],
    defaultStep: 30,
    qualityLimits: ["SD", "HD"],
    noStyleSuffix: false,
    isPremium: true,
    promptSuffix: null
  },
  animeNsfw: {
    name: "Ring.1 Anime",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/John6666/mala-anime-mix-nsfw-pony-xl-v5-sdxl",
    inferenceSteps: [35, 40, 45],
    defaultStep: 40,
    qualityLimits: null,
    noStyleSuffix: true,
    isPremium: true,
    promptSuffix: null
  },
  nsfwMaster: {
    name: "Ring.1N",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/pimpilikipilapi1/NSFW_master",
    inferenceSteps: [30, 35, 40, 45, 50],
    defaultStep: 30,
    qualityLimits: null,
    noStyleSuffix: true,
    isPremium: false,
    promptSuffix: null
  }
};