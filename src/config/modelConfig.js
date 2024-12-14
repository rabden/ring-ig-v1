export const modelConfig = {
  turbo: {
    name: "Ring.1 turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large-turbo",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: null,
    tagline: "Fast generation with good quality",
    image: "/models/turbo.png"
  },
  flux: {
    name: "Ring.1",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Balanced speed and quality",
    image: "/models/flux.png"
  },
  fluxDev: {
    name: "Ring.1 hyper",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    qualityLimits: null,
    isPremium: true,
    promptSuffix: null,
    tagline: "High-quality artistic creations",
    image: "/models/fluxdev.png"
  },
  ultra: {
    name: "Ultra",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Ultimate-LoRA-Collection",
    qualityLimits: null,
    isPremium: true,
    promptSuffix: null,
    tagline: "Ultimate quality and detail",
    image: "/models/ultra.png"
  },
  animeNsfw: {
    name: "Ring.1 Anime",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/John6666/mala-anime-mix-nsfw-pony-xl-v5-sdxl",
    qualityLimits: null,
    isPremium: true,
    promptSuffix: null,
    tagline: "Anime-style NSFW generation",
    image: "/models/anime.png"
  },
  nsfwMaster: {
    name: "Ring.1N",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/pimpilikipilapi1/NSFW_master",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Advanced NSFW generation",
    image: "/models/nsfw.png"
  }
};