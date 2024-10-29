const MAX_RETRIES = 5;

export const getRetryInterval = (statusCode) => {
  switch (statusCode) {
    case 504: return 10000;  // 10 seconds for timeouts
    case 503: return 120000; // 2 minutes for service unavailable
    case 500: return 10000;  // 10 seconds for server errors
    case 429: return 2000;   // 2 seconds for rate limits
    default: return 5000;    // 5 seconds for other cases
  }
};

export const shouldRetry = (statusCode, retryCount) => {
  const retryableStatuses = [500, 503, 504, 429];
  return retryableStatuses.includes(statusCode) && retryCount < MAX_RETRIES;
};

export const handleApiResponse = async (response, retryCount, retryFn) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error('API response error:', errorData);

    if (shouldRetry(response.status, retryCount)) {
      const retryInterval = getRetryInterval(response.status);
      console.log(`Retrying image generation in ${retryInterval / 1000} seconds. Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
      return retryFn(retryCount + 1);
    }

    throw new Error(`API error: ${errorData.error || response.statusText}`);
  }

  return await response.blob();
};