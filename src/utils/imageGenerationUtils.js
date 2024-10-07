import { aspectRatios } from '@/utils/imageConfigs';

const MAX_RETRIES = 5;

const getRetryInterval = (statusCode) => {
  switch (statusCode) {
    case 503: return 120000; // 2 minutes
    case 500: return 10000;  // 10 seconds
    case 429: return 2000;   // 2 seconds
    default: return 5000;    // 5 seconds for other cases
  }
};

export const makeDivisibleBy8 = (num) => Math.floor(num / 8) * 8;

export const calculateDimensions = (useAspectRatio, aspectRatio, width, height, maxDimension) => {
  let finalWidth, finalHeight;

  if (useAspectRatio && aspectRatios[aspectRatio]) {
    const { width: ratioWidth, height: ratioHeight } = aspectRatios[aspectRatio];
    const aspectRatioValue = ratioWidth / ratioHeight;

    if (aspectRatioValue > 1) {
      finalWidth = maxDimension;
      finalHeight = Math.round(finalWidth / aspectRatioValue);
    } else {
      finalHeight = maxDimension;
      finalWidth = Math.round(finalHeight * aspectRatioValue);
    }
  } else {
    finalWidth = Math.min(maxDimension, width);
    finalHeight = Math.min(maxDimension, height);
  }

  return {
    width: makeDivisibleBy8(finalWidth),
    height: makeDivisibleBy8(finalHeight)
  };
};

export const handleApiResponse = async (response, retryCount, generateImage) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error('API response error:', errorData);

    const retryableErrors = [500, 503, 429];
    if (retryableErrors.includes(response.status)) {
      if (retryCount < MAX_RETRIES) {
        const retryInterval = getRetryInterval(response.status);
        console.log(`Retrying image generation in ${retryInterval / 1000} seconds. Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, retryInterval));
        return generateImage(retryCount + 1);
      } else {
        throw new Error(`Max retries reached. Unable to generate image. Last error: ${errorData.error || response.statusText}`);
      }
    }

    throw new Error(`API error: ${errorData.error || response.statusText}`);
  }

  return await response.blob();
};