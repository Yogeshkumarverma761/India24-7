const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = await response.text();
    }
    console.error(`[API Error] ${response.status}: ${errorMessage}`);
    throw new Error(errorMessage);
  }
  return response.json();
};

export const complaintService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/complaints/`);
    const data = await handleResponse(response);
    // map flat API data to nested format expected by UI
    return (Array.isArray(data) ? data : data.complaints || []).map(c => ({
      ...c,
      user: { name: c.user_name || 'Citizen', avatar: c.user_avatar || 'U' }
    }));
  },
  getById: async (id) => {
    const response = await fetch(`${API_URL}/complaints/${id}`);
    const c = await handleResponse(response);
    return { ...c, user: { name: c.user_name || 'Citizen', avatar: c.user_avatar || 'U' } };
  },
  create: async (complaintData) => {
    // Map UI data to backend API format
    const payload = {
      category: complaintData.category || complaintData.issueType || 'Other',
      title: complaintData.title || '',
      description: complaintData.description || '',
      location: complaintData.location || '',
      lat: complaintData.lat || 0,
      lng: complaintData.lng || 0,
      user_name: complaintData.user?.name || complaintData.user_name || 'Citizen',
      user_avatar: complaintData.user?.avatar || complaintData.user_avatar || 'U'
    };
    
    const response = await fetch(`${API_URL}/complaints/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const c = await handleResponse(response);
    return { ...c, user: { name: c.user_name || 'Citizen', avatar: c.user_avatar || 'U' } };
  },
  upvote: async (id) => {
    const response = await fetch(`${API_URL}/complaints/${id}/upvote`, {
      method: 'POST',
    });
    return handleResponse(response);
  },
};

export const userService = {
  getLeaderboard: async () => {
    const response = await fetch(`${API_URL}/users/leaderboard`);
    return handleResponse(response);
  },
  getOfficerStats: async () => {
    const response = await fetch(`${API_URL}/users/officer`);
    return handleResponse(response);
  },
};

export const rewardService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/rewards/`);
    return handleResponse(response);
  },
};

export const aiService = {
  report: async (message, history = [], system_prompt = null) => {
    const response = await fetch(`${API_URL}/ai/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, system_prompt }),
    });
    return handleResponse(response);
  },
  analyzePhoto: async (file, category = "") => {
    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);
    const response = await fetch(`${API_URL}/ai/analyze-photo`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },
  voice: async (message, history = [], system_prompt = null) => {
    const response = await fetch(`${API_URL}/ai/voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, system_prompt }),
    });
    return handleResponse(response);
  },
  summarize: async (category, description, location) => {
    const response = await fetch(`${API_URL}/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, description, location }),
    });
    return handleResponse(response);
  },
};

export const authService = {
  sendOtp: async (email) => {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },
  verifyOtp: async (email, otp) => {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return handleResponse(response);
  },
};
