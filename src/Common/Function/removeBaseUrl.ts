const removeBaseUrl = (url: string | null): string | null => {
  if (url === null) return null;
  const urlObj = new URL(url);
  return urlObj.pathname + urlObj.search;
};

export default removeBaseUrl;
