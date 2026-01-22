import axios from 'axios';
import { BloodGlucoseReading } from '@/types';

const LIBRE_API_URL = process.env.LIBRE_API_URL || 'https://api-us.libreview.io';
const LIBRE_CLIENT_ID = process.env.LIBRE_CLIENT_ID;
const LIBRE_CLIENT_SECRET = process.env.LIBRE_CLIENT_SECRET;

interface LibreAuthResponse {
  status: number;
  data: {
    authTicket: {
      token: string;
      expires: number;
      duration: number;
    };
  };
}

interface LibreGlucoseEntry {
  FactoryTimestamp: string;
  Timestamp: string;
  type: number;
  ValueInMgPerDl: number;
  TrendArrow?: number;
  MeasurementColor?: number;
}

interface LibreConnectionsResponse {
  status: number;
  data: Array<{
    patientId: string;
    firstName: string;
    lastName: string;
    glucoseMeasurement?: {
      FactoryTimestamp: string;
      Timestamp: string;
      type: number;
      ValueInMgPerDl: number;
      TrendArrow?: number;
    };
    glucoseItem?: {
      FactoryTimestamp: string;
      Timestamp: string;
      type: number;
      ValueInMgPerDl: number;
      TrendArrow?: number;
    };
  }>;
}

interface LibreGraphResponse {
  status: number;
  data: {
    connection: {
      patientId: string;
      glucoseMeasurement?: LibreGlucoseEntry;
    };
    graphData: LibreGlucoseEntry[];
  };
}

export class LibreClient {
  private authToken: string;
  private patientId?: string;

  constructor(authToken: string, patientId?: string) {
    this.authToken = authToken;
    this.patientId = patientId;
  }

  // Authenticate with LibreView
  static async authenticate(email: string, password: string): Promise<LibreClient> {
    try {
      const response = await axios.post<LibreAuthResponse>(
        `${LIBRE_API_URL}/llu/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'product': 'llu.android',
            'version': '4.7.0',
          },
        }
      );

      if (response.data.status !== 0) {
        throw new Error('LibreView authentication failed');
      }

      return new LibreClient(response.data.data.authTicket.token);
    } catch (error) {
      console.error('LibreView authentication error:', error);
      throw new Error('Failed to authenticate with LibreView');
    }
  }

  // Get patient connections (for users monitoring others, or their own data)
  async getConnections(): Promise<string[]> {
    try {
      const response = await axios.get<LibreConnectionsResponse>(
        `${LIBRE_API_URL}/llu/connections`,
        {
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
            'product': 'llu.android',
            'version': '4.7.0',
          },
        }
      );

      if (response.data.status !== 0) {
        throw new Error('Failed to get connections');
      }

      return response.data.data.map((conn) => conn.patientId);
    } catch (error) {
      console.error('LibreView get connections error:', error);
      throw new Error('Failed to fetch connections from LibreView');
    }
  }

  // Get glucose readings for a patient
  async getGlucoseReadings(
    patientId?: string
  ): Promise<BloodGlucoseReading[]> {
    const targetPatientId = patientId || this.patientId;

    if (!targetPatientId) {
      throw new Error('Patient ID is required');
    }

    try {
      const response = await axios.get<LibreGraphResponse>(
        `${LIBRE_API_URL}/llu/connections/${targetPatientId}/graph`,
        {
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
            'product': 'llu.android',
            'version': '4.7.0',
          },
        }
      );

      if (response.data.status !== 0) {
        throw new Error('Failed to get glucose data');
      }

      const graphData = response.data.data.graphData || [];

      return graphData
        .filter((entry) => entry.ValueInMgPerDl > 0)
        .map((entry) => ({
          timestamp: new Date(entry.Timestamp),
          value: entry.ValueInMgPerDl,
          trend: this.mapTrend(entry.TrendArrow),
          source: 'libre',
          cgmProvider: 'libre',
        } as BloodGlucoseReading));
    } catch (error) {
      console.error('LibreView get glucose readings error:', error);
      throw new Error('Failed to fetch glucose readings from LibreView');
    }
  }

  private mapTrend(trendArrow?: number): BloodGlucoseReading['trend'] {
    if (!trendArrow) return 'stable';

    switch (trendArrow) {
      case 1: // Rising rapidly
        return 'rapidlyRising';
      case 2: // Rising
        return 'rising';
      case 3: // Stable
        return 'stable';
      case 4: // Falling
        return 'falling';
      case 5: // Falling rapidly
        return 'rapidlyFalling';
      default:
        return 'stable';
    }
  }

  setPatientId(patientId: string): void {
    this.patientId = patientId;
  }

  getAuthToken(): string {
    return this.authToken;
  }
}
