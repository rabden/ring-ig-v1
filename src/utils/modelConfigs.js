export const modelConfigs = {
  flux: {
    name: "Fast",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    inferenceSteps: [4, 8, 12, 16, 20],
    defaultStep: 8
  },
  fluxDev: {
    name: "Quality",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 30
  },
  nsfwMaster: {
    name: "Reality",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/pimpilikipilapi1/NSFW_master",
    inferenceSteps: [30, 35, 40, 45, 50],
    defaultStep: 35
  },
  animeNsfw: {
    name: "Anime",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/John6666/rdxl-anime-sdxlpony7-sdxl",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 30
  }
};

export const styleConfigs = {
  general: {
    name: "General",
    suffix: "ultra-detailed, hyper-realistic, cinematic lighting, dynamic composition, intricate textures, volumetric lighting, soft shadows, vivid colors, highly polished, 8K resolution, photorealistic rendering, depth of field, with sharp details and perfect symmetry"
  },
  anime: {
    name: "Anime",
    suffix: "in a highly detailed anime art style, with vibrant colors, dynamic lighting, clean lines, expressive facial features, large eyes, and a stylized background. The characters should have smooth, cel-shaded textures and distinct, exaggerated emotions, similar to traditional Japanese animation. The atmosphere should be lively, with intricate attention to details in the scenery and character clothing"
  },
  "3d": {
    name: "3D",
    suffix: "3D rendered, octane render, highly detailed 3D model, perfect lighting, ray tracing, subsurface scattering, volumetric lighting, high-end 3D visualization"
  },
  realistic: {
    name: "Realistic",
    suffix: "photorealistic, highly detailed, professional photography, 8K UHD, sharp focus, DSLR, high-end photography, masterful composition, natural lighting"
  },
  illustration: {
    name: "Illustration",
    suffix: "digital illustration, highly detailed artwork, professional illustration, clean lines, perfect composition, vibrant colors, artistic masterpiece"
  },
  logo: {
    name: "Logo",
    suffix: "minimalist logo design, vector art, professional branding, clean lines, scalable, corporate identity, modern logo"
  },
  graphics: {
    name: "Graphics",
    suffix: "graphic design, vector art, clean design, professional layout, modern aesthetics, perfect typography, balanced composition"
  }
};