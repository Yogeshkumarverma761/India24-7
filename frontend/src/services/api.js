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
    return handleResponse(response);
  },
  getById: async (id) => {
    const response = await fetch(`${API_URL}/complaints/${id}`);
    return handleResponse(response);
  },
  create: async (complaintData) => {
    const response = await fetch(`${API_URL}/complaints/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData),
    });
    return handleResponse(response);
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
