import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { AttractionService } from '../attraction/attraction.service';

@Injectable()
export class TripService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly attractionService: AttractionService
  ) {}

  // 일수 별 관광지 수
  DAYS_BY_ATTRACTION_NUMBER = 2;

  /**
   * 날짜별로 관광지 정보와 날씨 요약 정보 조회
   * @param city
   * @param days
   */
  async planTrip(city: string, days: number): Promise<any> {
    const weatherData = await this.weatherService.getForecast(city, days);
    const attractionData = await this.attractionService.getAttractions(city, days * this.DAYS_BY_ATTRACTION_NUMBER);

    if (weatherData.error) return weatherData;
    if (attractionData.error) return attractionData;

    const forecasts = weatherData.forecasts || [];
    const attractions = attractionData.attractions || [];

    // 일자 별 날씨와 관광지 정보 가공
    const plan = forecasts.map((forecast: any, idx: number) => {
      const start = idx * this.DAYS_BY_ATTRACTION_NUMBER;
      const end = start + this.DAYS_BY_ATTRACTION_NUMBER;
      return {
        date: forecast.date,
        weather: `${forecast.description}, ${forecast.avgTemperature}°C`,
        attractions: attractions.slice(start, end).map((attraction: any) => attraction.name)
      };
    });

    return {
      city,
      days,
      plan,
      source: 'Travel Planner MCP',
    };
  }
}
