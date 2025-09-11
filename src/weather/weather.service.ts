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

  /**
   * 현재 도시의 날씨 조회
   * @param city
   */
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
        source: 'OpenWeather - Current weather data',
      };
    } catch (error) {
      return {
        error: 'Failed to fetch weather data',
        details: error.response?.data || error.message,
      };
    }
  }

  /**
   * 도시별 예보 조회 (최대 5일)
   * days: 1~5 (하루 단위)
   * @param city
   * @param days
   */
  async getForecast(city: string, days: number): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast`;
    const params = {
      q: city,
      appid: this.apiKey,
      units: 'metric',
      lang: 'kr',
    };

    try {
      const response = await lastValueFrom(this.http.get(url, { params }));
      const responseData = response.data;

      // 위 OpenWeather API는 3시간 단위로 40개의 날씨 데이터가 나오므로 날짜 별로 그룹화 후 하루 평균 값으로 요약한다.
      const grouped: Record<string, any[]> = {};

      responseData.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0]; // yyyy-mm-dd
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(item);
      });

      // 날짜별 기후 요약 정보
      const forecasts = Object.keys(grouped)
        .slice(0, days) // 요청한 일 수만큼 자르기
        .map((date) => {
          const groupItems = grouped[date];
          // 날짜별 평균 기후 계산 (총합 / 동일 날짜 아이템 길이)
          // 소수점 첫째 자리까지 반올림
          const avgTemp = Math.round(
            (groupItems.reduce((sum, item) => sum + item.main.temp, 0) / groupItems.length) * 10
          ) / 10

          return {
            date,
            avgTemperature: avgTemp,
            description: groupItems[0].weather[0].description,
          };
        });

      return {
        city: responseData.city.name,
        days: forecasts.length,
        forecasts,
        source: 'OpenWeather - 5 day weather forecast',
      };
    } catch (error) {
      return {
        error: 'Failed to fetch forecast data',
        details: error.response?.data || error.message,
      };
    }
  }
}
