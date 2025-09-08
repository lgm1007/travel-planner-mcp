import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {
  async getWeather(city: string): Promise<any> {
    // TODO: OpenWeather API 연동
    return {
      city: city,
      temperature: 22,
      description: 'Clear Sky',
      source: 'dummy data',
    };
  }
}
