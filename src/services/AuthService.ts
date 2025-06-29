import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'dishly_user_auth';

export interface User {
  id: string;
  email: string;
  name: string;
}

// Dummy accounts for testing
const DUMMY_ACCOUNTS = [
  {
    email: 'nathan@dishly.com',
    password: '1234',
    user: {
      id: 'nathan_001',
      email: 'nathan@dishly.com',
      name: 'Nathan',
    }
  }
];

class AuthService {
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<User> {
    // Check for dummy accounts first
    const dummyAccount = DUMMY_ACCOUNTS.find(
      account => account.email.toLowerCase() === email.toLowerCase() && account.password === password
    );

    let user: User;

    if (dummyAccount) {
      // Use predefined dummy account
      user = dummyAccount.user;
    } else {
      // For any other email/password combination, create a generic user
      user = {
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0], // Use email prefix as name
      };
    }

    this.currentUser = user;
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const userJson = await AsyncStorage.getItem(AUTH_KEY);
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    return null;
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    // Simulate API call
    const user: User = {
      id: Date.now().toString(),
      email: email,
      name: name,
    };

    this.currentUser = user;
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
}

export const authService = new AuthService(); 