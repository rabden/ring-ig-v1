export const modelConfig = {
  turbo: {
    name: "SD-3.5Large-turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large-turbo",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: null,
    tagline: "Fast generation with good quality",
    image: "/models/turbo.png"
  },
  flux: {
    name: "Flux.1 Schnell",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Balanced speed and quality",
    image: "/models/flux.png"
  },
  fluxDev: {
    name: "FLx.1 Dev",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "High-quality artistic creations",
    image: "/models/fluxdev.png"
  },
  fastReal: {
    name: "Realism turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Simple-Doodle-SD3.5-Turbo",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: null,
    tagline: "make realistic images fast",
    image: "/models/ultra.png"
  },
  Illustturbo: {
    name: "Illustration turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Simple-Doodle-SD3.5-Turbo",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: null,
    tagline: "make simple illustrations fast",
    image: "/models/ultra.png"
  },
  render3d: {
    name: "3D Render",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/goofyai/3d_render_style_xl",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: null,
    tagline: "render 3D images",
    image: "/models/ultra.png"
  },
  anime: {
    name: "Anime-Xl",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Nishitbaria/Anime-style-flux-lora-Large",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Flwaless Anime style images",
    image: "/models/ultra.png"
  },
  midjourney: {
    name: "Midjourney",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Latest version of Midjourney for free",
    image: "/models/ultra.png"
  },
  vertorArt: {
    name: "Vector Art",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/lichorosario/flux-lora-simple-vector",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Create Vector arts",
    image: "/models/ultra.png"
  },
  Isometric: {
    name: "Isometric",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Isometric-Site-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Isometric style, build your world",
    image: "/models/ultra.png"
  },
  outfitGenerator: {
    name: "Outfit Generator",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Teen-Outfit",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Make cool outfits and cloths",
    image: "/models/ultra.png"
  },
  colorChaos: {
    name: "Color Chaos",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Digital-Chaos-Flux-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Chaos of Colors to make modern art",
    image: "/models/ultra.png"
  },
  aura: {
    name: "Aura 999+",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Aura-9999",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "gives your creations some aura",
    image: "/models/ultra.png"
  },
  ultra: {
    name: "Flux.1 Pro",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Ultimate-LoRA-Collection",
    qualityLimits: null,
    isPremium: true,
    promptSuffix: null,
    tagline: "A merge of multiple models",
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