import axios from 'axios';
import { BloodGlucoseReading, CGMConfig } from '@/types';

const DEXCOM_API_URL = process.env.DEXCOM_API_URL || 'https://sandbox-api.dexcom.com';
const DEXCOM_CLIENT_ID = process.env.DEXCOM_CLIENT_ID;
const DEXCOM_CLIENT_SECRET = process.env.DEXCOM_CLIENT_SECRET;
const DEXCOM_REDIRECT_URI = process.env.DEXCOM_REDIRECT_URI;

interface DexcomTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface DexcomEGV {
  systemTime: string;
  displayTime: string;
  value: number;
  trend?: string;
  trendRate?: number;
}

export class DexcomClient {
  private accessToken: string;
  private refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  // Get authorization URL for OAuth flow
  static getAuthorizationUrl(state: string): string {
    if (!DEXCOM_CLIENT_ID || !DEXCOM_REDIRECT_URI) {
      throw new Error('Dexcom credentials not configured');
    }

    const params = new URLSearchParams({
      client_id: DEXCOM_CLIENT_ID,
      redirect_uri: DEXCOM_REDIRECT_URI,
      response_type: 'code',
      scope: 'offline_access',
      state,
    });

    return `${DEXCOM_API_URL}/v2/oauth2/login?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  static async exchangeCodeForTokens(code: string): Promise<DexcomTokenResponse> {
    if (!DEXCOM_CLIENT_ID || !DEXCOM_CLIENT_SECRET || !DEXCOM_REDIRECT_URI) {
      throw new Error('Dexcom credentials not configured');
    }

    try {
      const response = await axios.post<DexcomTokenResponse>(
        `${DEXCOM_API_URL}/v2/oauth2/token`,
        {
          client_id: DEXCOM_CLIENT_ID,
          client_secret: DEXCOM_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: DEXCOM_REDIRECT_URI,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Dexcom token exchange error:', error);
      throw new Error('Failed to exchange authorization code');
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string> {
    if (!DEXCOM_CLIENT_ID || !DEXCOM_CLIENT_SECRET) {
      throw new Error('Dexcom credentials not configured');
    }

    try {
      const response = await axios.post<DexcomTokenResponse>(
        `${DEXCOM_API_URL}/v2/oauth2/token`,
        {
          client_id: DEXCOM_CLIENT_ID,
          client_secret: DEXCOM_CLIENT_SECRET,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      return this.accessToken;
    } catch (error) {
      console.error('Dexcom token refresh error:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  // Get glucose readings
  async getGlucoseReadings(
    startDate: Date,
    endDate: Date
  ): Promise<BloodGlucoseReading[]> {
    try {
      const response = await axios.get<{ egvs: DexcomEGV[] }>(
        `${DEXCOM_API_URL}/v3/users/self/egvs`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data.egvs.map((egv) => ({
        timestamp: new Date(egv.systemTime),
        value: egv.value,
        trend: this.mapTrend(egv.trend),
        source: 'dexcom',
        cgmProvider: 'dexcom',
      } as BloodGlucoseReading));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token expired, try refreshing
        await this.refreshAccessToken();
        return this.getGlucoseReadings(startDate, endDate);
      }
      console.error('Dexcom get glucose readings error:', error);
      throw new Error('Failed to fetch glucose readings from Dexcom');
    }
  }

  private mapTrend(trend?: string): BloodGlucoseReading['trend'] {
    if (!trend) return 'stable';

    switch (trend.toLowerCase()) {
      case 'doubleup':
      case 'singleup':
        return 'rising';
      case 'fortyfiveup':
        return 'stable';
      case 'flat':
        return 'stable';
      case 'fortyfivedown':
        return 'stable';
      case 'singledown':
      case 'doubledown':
        return 'falling';
      default:
        return 'stable';
    }
  }

  getTokens(): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }
}
