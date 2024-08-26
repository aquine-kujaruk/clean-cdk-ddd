import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

type ApiResponse = {
  data: any;
  status: number;
};

export class AxiosAdapter {
  static async get(url: string, config: AxiosRequestConfig = {}): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await axios.get(url, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: unknown) {
      throw new AxiosAdapterException(error, 'GET', url);
    }
  }

  static async post(url: string, data: any, config: AxiosRequestConfig = {}): Promise<ApiResponse> {
    try {
      const response: AxiosResponse = await axios.post(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: unknown) {
      throw new AxiosAdapterException(error, 'POST', url);
    }
  }
}

class AxiosAdapterException extends Error {
  constructor(error: unknown, method: string, url: string) {
    super();
    this.name = 'AxiosAdapterException';
    this.message = this.generateErrorMessage(error as AxiosError, method, url);
    this.logError();
  }

  private generateErrorMessage(error: AxiosError, method: string, url: string): string {
    if (error.response) {
      return `[AxiosAdapter] [${method}] Error ${error.response.status} on ${url}: ${JSON.stringify(
        error.response.data
      )}`;
    } else if (error.request) {
      return `[AxiosAdapter] [${method}] No response received for request to ${url}: ${JSON.stringify(
        error.request
      )}`;
    } else {
      return `[AxiosAdapter] [${method}] Error setting up request to ${url}: ${error.message}`;
    }
  }

  private logError(): void {
    console.error(this.message);
  }
}
