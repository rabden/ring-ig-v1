export const modelConfig = {
  turbo: {
    name: "Turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo",
    defaultStep: 4,
    qualityLimits: ["SD", "HD"],
    noStyleSuffix: true,
    isPremium: false,
    promptSuffix: ""
  },
  preLar: {
    name: "PreLar",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    defaultStep: 30,
    qualityLimits: ["SD", "HD"],
    noStyleSuffix: false,
    isPremium: false,
    promptSuffix: ""
  },
  flux: {
    name: "Flux",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    defaultStep: 35,
    qualityLimits: ["SD", "HD", "HD+"],
    noStyleSuffix: false,
    isPremium: true,
    promptSuffix: ""
  },
  fluxDev: {
    name: "Flux Dev",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
    defaultStep: 35,
    qualityLimits: ["SD", "HD", "HD+"],
    noStyleSuffix: false,
    isPremium: true,
    promptSuffix: ""
  },
  nsfwMaster: {
    name: "NSFW Master",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
    defaultStep: 35,
    qualityLimits: ["SD", "HD", "HD+"],
    noStyleSuffix: true,
    isPremium: false,
    promptSuffix: ", nsfw"
  },
  nsfwPro: {
    name: "NSFW Pro",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
    defaultStep: 35,
    qualityLimits: ["SD", "HD", "HD+"],
    noStyleSuffix: true,
    isPremium: true,
    promptSuffix: ", nsfw, high quality"
  }
};