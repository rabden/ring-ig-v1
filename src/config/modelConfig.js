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
  sd35l: {
    name: "SD-3.5Large",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: null,
    tagline: "Latest Stable diffusion model",
    image: "/models/turbo.png"
  },
  fluxDev: {
    name: "FLx.1 Dev",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Flux dev by black forest labs",
    image: "/models/fluxdev.png"
  },
  fastReal: {
    name: "Realism turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/SD3.5-Large-Photorealistic-LoRA",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: ", photography, photorealistic",
    tagline: "make realistic images fast",
    image: "https://i.ibb.co.com/JrYsbmT/SD3.webp"
  },
  Illustturbo: {
    name: "Illustration turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Simple-Doodle-SD3.5-Turbo",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: ", Simple Doodle",
    tagline: "make simple illustrations fast",
    image: "https://i.ibb.co.com/Mhk3M6v/SD1.webp"
  },
  render3d: {
    name: "3D Render XL",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/goofyai/3d_render_style_xl",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: ", 3d render",
    tagline: "render 3D images",
    image: "https://i.ibb.co.com/sbmM5mp/3d-style-2.jpg"
  },
  anime: {
    name: "Anime XL",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Nishitbaria/Anime-style-flux-lora-Large",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", anm",
    tagline: "Flwaless Anime style images",
    image: "https://i.ibb.co.com/k2YdjZK/images-example-7y3r4uk1q.jpg"
  },
  anime2xl: {
    name: "Anime XL Fast",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.0",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: ", anime",
    tagline: "Anime style images make fast",
    image: "https://i.ibb.co.com/bgYbVQJ/Euv-INv-Bs-CKZQusp-ZHN-u-F.png"
  },
  midjourney: {
    name: "Midjourney-V6",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", MJ v6",
    tagline: "Latest version of Midjourney for free",
    image: "https://i.ibb.co.com/8PnDLkf/1.png"
  },
  sketchart: {
    name: "Sketch Art",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Datou1111/shou_xin",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", shou_xin, pencil sketch",
    tagline: "sketch art pencil and colors",
    image: "https://i.ibb.co.com/P4xLs4W/img-00282.png"
  },
  vertorArt: {
    name: "Vector Art",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/lichorosario/flux-lora-simple-vector",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", v3ct0r, vector",
    tagline: "Create Vector arts",
    image: "https://i.ibb.co.com/wKszPV2/images-example-ylmvpzdqk.jpg"
  },
  Isometric: {
    name: "Isometric",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Isometric-Site-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Isometric Building",
    tagline: "Isometric style, build your world",
    image: "https://i.ibb.co.com/84bxty7/2.png"
  },
  handwriting: {
    name: "Handwriting",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/fofr/flux-handwriting",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", HWRIT handwriting",
    tagline: "Real lookin handwriting images",
    image: "https://i.ibb.co.com/mFPgMkj/0041358a-ee46-4cab-85f5-108c4f09b729.jpg"
  },
  outfitGenerator: {
    name: "Outfit Generator",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Teen-Outfit",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Teen Outfit",
    tagline: "Make cool outfits and cloths",
    image: "https://i.ibb.co.com/MCWQZBN/TO3.png"
  },
  colorChaos: {
    name: "Color Chaos",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Digital-Chaos-Flux-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Digital Chaos",
    tagline: "Chaos of Colors to make modern art",
    image: "https://i.ibb.co.com/TgcCsdf/HDRDC2.webp"
  },
  pixelArt: {
    name: "Pixel Art",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/nerijs/pixel-art-3.5L",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: ", pixel art",
    tagline: "CModern Pixel art",
    image: "https://i.ibb.co.com/DkdtLrG/Comfy-UI-00047.png"
  },
  iconkit: {
    name: "Icon Kit",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Icon-Kit-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Icon kit",
    tagline: "3d Icons",
    image: "https://i.ibb.co.com/cxqCCnf/1-1.png"
  },
  aura: {
    name: "Aura 9999+",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Aura-9999",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Aura 9999",
    tagline: "gives your creations some aura",
    image: "https://i.ibb.co.com/NNWjs4d/A3.png"
  },
  disney: {
    name: "Disney",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Keltezaa/all-disney-princess-xl-lora-model-from-ralph-breaks-the-internet",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: nll,
    tagline: "Disney princes, use name",
    image: "https://i.ibb.co.com/54bxzMk/4058459.jpg"
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
  nsfwMaster: {
    name: "Real",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/aifeifei798/sldr_flux_nsfw_v2-studio",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Nsfw, naked,",
    tagline: "NSFW generation",
    image: "https://i.ibb.co.com/qm9ZjV4/b36e71ed-c142-49c4-8ba5-4f3a57bd6ae9.jpg"
  },
  animeNsfw: {
    name: "Anime",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/John6666/mala-anime-mix-nsfw-pony-xl-v5-sdxl",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Anime-style NSFW generation",
    image: "https://i.ibb.co.com/Tt1gwLG/1730283256633.jpg"
  },
  nudephotography: {
    name: "Nude Photography",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/Keltezaa/Prof_Nude_photography_v3_flux",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Nude photograpy, naked",
    tagline: "Nude models for Photoshoot",
    image: "https://i.ibb.co.com/GW2LDP1/example-20kld8mba.jpg"
  }
};
