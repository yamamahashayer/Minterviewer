import api from './api';

export class BaseService {
  protected api = api;

  protected handleError(error: any, defaultMessage: string = 'Request failed') {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || defaultMessage;
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || defaultMessage);
    }
  }

  protected async get<T>(url: string, params?: any, customHeaders?: any): Promise<T> {
    try {
      const config: any = { params };
      if (customHeaders) {
        config.headers = customHeaders;
      }
      const response = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.api.delete(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
