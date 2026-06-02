import { createSlice } from '@reduxjs/toolkit';

const loadTokenFromStorage = () => {
  const t = localStorage.getItem('token');
  return t && t !== 'undefined' && t !== 'null' ? t : null;
};

const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser || storedUser === 'undefined' || storedUser === 'null') return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: loadTokenFromStorage(),
    user: loadUserFromStorage(),
  },
  reducers: {
    loginUser(state, action) {
      const { token, user } = action.payload;
      if (token) {
        localStorage.setItem('token', token);
        state.token = token;
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        state.user = user;
      }
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
    },
    updateUser(state, action) {
      const updatedUser = action.payload;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      state.user = updatedUser;
    },
  },
});

export const { loginUser, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
