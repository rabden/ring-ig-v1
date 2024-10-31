-- Create model_configs table
CREATE TABLE public.model_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    api_url TEXT NOT NULL,
    inference_steps INTEGER[] NOT NULL,
    default_step INTEGER NOT NULL,
    quality_limits TEXT[] DEFAULT NULL,
    no_style_suffix BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    prompt_suffix TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create style_configs table
CREATE TABLE public.style_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    suffix TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial model configs
INSERT INTO public.model_configs (key, name, category, api_url, inference_steps, default_step, quality_limits, is_premium, no_style_suffix, prompt_suffix)
VALUES
    ('turbo', 'Ring.1 turbo', 'General', 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large-turbo', ARRAY[4], 4, ARRAY['SD', 'HD'], false, false, null),
    ('flux', 'Ring.1', 'General', 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', ARRAY[4, 8, 12, 16, 20], 8, null, false, false, null),
    ('fluxDev', 'Ring.1 hyper', 'General', 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev', ARRAY[25, 30, 35, 40, 45], 30, null, true, false, null),
    ('preLar', 'Ring.1 Pre-lar', 'General', 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large', ARRAY[50], 50, ARRAY['SD', 'HD'], true, false, null),
    ('animeNsfw', 'Ring.1 Anime', 'NSFW', 'https://api-inference.huggingface.co/models/John6666/mala-anime-mix-nsfw-pony-xl-v5-sdxl', ARRAY[35], 35, null, true, true, null),
    ('nsfwMaster', 'Ring.1N', 'NSFW', 'https://api-inference.huggingface.co/models/pimpilikipilapi1/NSFW_master', ARRAY[30, 35, 40, 45, 50], 35, null, false, true, null);

-- Insert initial style configs
INSERT INTO public.style_configs (key, name, suffix, is_premium)
VALUES
    ('general', 'General', '8k, uhd, professional, masterpiece, high-quality, detailed, sharp focus, high-resolution, intricate details, realistic lighting, professional photography, photorealistic', false),
    ('anime', 'Anime', 'anime style, manga art, cel shading, vibrant colors, clean lines, anime aesthetic, Studio Ghibli inspired, detailed eyes, dynamic poses, 2D animation, japanese animation style', false),
    ('3d', '3D', 'octane render, 3D model, ray tracing, volumetric lighting, subsurface scattering, ambient occlusion, physically based rendering, 3D visualization, blender art, cinema4d', true),
    ('realistic', 'Realistic', 'photorealistic, hyperrealistic, photoreal, DSLR photo, 35mm film, professional photography, natural lighting, studio lighting, color grading, raw photo', false),
    ('illustration', 'Illustration', 'digital art, digital painting, professional illustration, concept art, editorial illustration, commercial art, digital illustration, artistic, painterly, illustrated', false),
    ('concept', 'Concept Art', 'concept art, visual development, environment design, character design, prop design, game art, film concept, key art, production art, conceptual design', false),
    ('watercolor', 'Watercolor', 'watercolor painting, wet on wet, traditional media, watercolor texture, fluid painting, organic texture, watercolor paper, traditional art, painted, artistic', true),
    ('comic', 'Comic', 'comic art, comic book style, graphic novel, ink drawing, cel shading, bold lines, comic panel, superhero art, action comics, manga style', true),
    ('minimalist', 'Minimalist', 'minimalist, simple, clean design, geometric, minimal, negative space, modern design, simplified forms, basic shapes, elegant', false),
    ('cyberpunk', 'Cyberpunk', 'cyberpunk, neon, sci-fi, futuristic, high tech, dystopian, cyber, synthwave, vaporwave, retrowave', false),
    ('retro', 'Retro', 'vintage, retro style, old school, nostalgic, 80s, 70s, classic, aged, film grain, analog', true),
    ('fantasy', 'Fantasy', 'fantasy art, magical, mystical, ethereal, enchanted, mythical, fairytale, dreamlike, surreal, otherworldly', false),
    ('abstract', 'Abstract', 'abstract art, non-representational, geometric, contemporary art, modern art, experimental, avant-garde, abstract expressionism, artistic', true),
    ('sketch', 'Sketch', 'pencil drawing, hand drawn, sketched, line art, traditional sketch, graphite, charcoal, rough sketch, drawing, doodle', false),
    ('oil', 'Oil Painting', 'oil painting, traditional art, impasto, glazing, classical painting, fine art, canvas texture, brush strokes, traditional media, painted', true),
    ('portrait', 'Portrait', 'portrait photography, headshot, studio portrait, professional portrait, beauty shot, fashion photography, editorial portrait, model photo', true),
    ('architectural', 'Architectural', 'architecture photography, architectural visualization, building design, interior design, exterior design, architectural rendering, urban design', true),
    ('nature', 'Nature', 'nature photography, landscape, wildlife, botanical, organic, environmental, outdoor, natural light, wilderness, scenic', false),
    ('pop', 'Pop Art', 'pop art style, andy warhol, roy lichtenstein, bold colors, halftone dots, comic style, pop culture, retro pop, artistic', true),
    ('pixel', 'Pixel Art', 'pixel art, 8-bit, 16-bit, retro gaming, pixelated, sprite art, game art, low-res, vintage gaming, digital pixel', false);

-- Enable RLS
ALTER TABLE public.model_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to model_configs" ON public.model_configs
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to style_configs" ON public.style_configs
    FOR SELECT TO public USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_model_configs_updated_at
    BEFORE UPDATE ON public.model_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_style_configs_updated_at
    BEFORE UPDATE ON public.style_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();