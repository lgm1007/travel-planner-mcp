import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY') ?? '';
  }

  async getWeather(city: string): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const params = {
      q: city,
      appid: this.apiKey,
      units: 'metric',
      lang: 'kr',
    };

    try {
      const response = await lastValueFrom(this.http.get(url, { params }));
      const data = response.data;

      return {
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        source: 'OpenWeather',
      };
    } catch (error) {
      return {
        error: 'Failed to fetch weather data',
        details: error.response?.data || error.message,
      };
    }
  }
}
