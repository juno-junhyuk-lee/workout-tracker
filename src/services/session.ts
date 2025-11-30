export type SessionUser = {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
};
// In-memory storage for the current user session
let currentUser: SessionUser | null = null;

// Function to set the current user  otherwise was losing the logged-in user info
export const setCurrentUser = (user: SessionUser | null) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;
