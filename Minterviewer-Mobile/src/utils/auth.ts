import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMenteeId = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;

    // For mobile, we'll need to implement session validation
    // For now, get from stored user data
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user?.menteeId || user?.mentee?._id || null;
    }

    return null;
  } catch (error) {
    console.error('Error getting menteeId:', error);
    return null;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};
