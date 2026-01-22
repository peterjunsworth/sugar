import axios from 'axios';
import { BloodGlucoseReading } from '@/types';

const EVERSENSE_API_URL = process.env.EVERSENSE_API_URL || 'https://api.eversensediabetes.com';
const EVERSENSE_CLIENT_ID = process.env.EVERSENSE_CLIENT_ID;
const EVERSENSE_CLIENT_SECRET = process.env.EVERSENSE_CLIENT_SECRET;
const EVERSENSE_REDIRECT_URI = process.env.EVERSENSE_REDIRECT_URI;

interface EversenseTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface EversenseGlucoseReading {
  timestamp: string;
  glucoseValue: number;
  trend?: string;
  systemTime?: string;
}

interface EversenseGlucoseResponse {
  readings: EversenseGlucoseReading[];
  nextPageToken?: string;
}

export class EversenseClient {
  private accessToken: string;
  private refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  // Get authorization URL for OAuth flow
  static getAuthorizationUrl(state: string): string {
    if (!EVERSENSE_CLIENT_ID || !EVERSENSE_REDIRECT_URI) {
      throw new Error('Eversense credentials not configured');
    }

    const params = new URLSearchParams({
      client_id: EVERSENSE_CLIENT_ID,
      redirect_uri: EVERSENSE_REDIRECT_URI,
      response_type: 'code',
      scope: 'glucose_read offline_access',
      state,
    });

    return `${EVERSENSE_API_URL}/v1/oauth2/authorize?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  static async exchangeCodeForTokens(code: string): Promise<EversenseTokenResponse> {
    if (!EVERSENSE_CLIENT_ID || !EVERSENSE_CLIENT_SECRET || !EVERSENSE_REDIRECT_URI) {
      throw new Error('Eversense credentials not configured');
    }

    try {
      const response = await axios.post<EversenseTokenResponse>(
        `${EVERSENSE_API_URL}/v1/oauth2/token`,
        {
          client_id: EVERSENSE_CLIENT_ID,
          client_secret: EVERSENSE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: EVERSENSE_REDIRECT_URI,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Eversense token exchange error:', error);
      throw new Error('Failed to exchange authorization code');
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string> {
    if (!EVERSENSE_CLIENT_ID || !EVERSENSE_CLIENT_SECRET) {
      throw new Error('Eversense credentials not configured');
    }

    try {
      const response = await axios.post<EversenseTokenResponse>(
        `${EVERSENSE_API_URL}/v1/oauth2/token`,
        {
          client_id: EVERSENSE_CLIENT_ID,
          client_secret: EVERSENSE_CLIENT_SECRET,
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
      console.error('Eversense token refresh error:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  // Get glucose readings
  async getGlucoseReadings(
    startDate: Date,
    endDate: Date
  ): Promise<BloodGlucoseReading[]> {
    try {
      const response = await axios.get<EversenseGlucoseResponse>(
        `${EVERSENSE_API_URL}/v1/glucose`,
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

      return response.data.readings.map((reading) => ({
        timestamp: new Date(reading.timestamp),
        value: reading.glucoseValue,
        trend: this.mapTrend(reading.trend),
        source: 'eversense',
        cgmProvider: 'eversense',
      } as BloodGlucoseReading));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token expired, try refreshing
        await this.refreshAccessToken();
        return this.getGlucoseReadings(startDate, endDate);
      }
      console.error('Eversense get glucose readings error:', error);
      throw new Error('Failed to fetch glucose readings from Eversense');
    }
  }

  private mapTrend(trend?: string): BloodGlucoseReading['trend'] {
    if (!trend) return 'stable';

    switch (trend.toLowerCase()) {
      case 'rapidlyincreasing':
      case 'rapidly_increasing':
        return 'rapidlyRising';
      case 'increasing':
        return 'rising';
      case 'stable':
        return 'stable';
      case 'decreasing':
        return 'falling';
      case 'rapidlydecreasing':
      case 'rapidly_decreasing':
        return 'rapidlyFalling';
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
