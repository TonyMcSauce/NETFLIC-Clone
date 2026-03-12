const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

export const api = {
  getMedia: (params = {}) => request(`/api/media?${new URLSearchParams(params)}`),
  getMediaById: (id) => request(`/api/media/${id}`),
  scanMedia: () => request('/api/media/scan', { method: 'POST' }),
  updateMedia: (id, body) => request(`/api/media/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  getProfiles: () => request('/api/profiles'),
  setActiveProfile: (profileId) => request('/api/profiles/active', { method: 'POST', body: JSON.stringify({ profileId }) }),
  toggleFavorite: (mediaId) => request(`/api/user/favorites/${mediaId}`, { method: 'POST' }),
  saveProgress: (body) => request('/api/user/progress', { method: 'POST', body: JSON.stringify(body) }),
  uploadThumbnail: async (file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    const response = await fetch('/api/admin/upload-thumbnail', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  }
};
