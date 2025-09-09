import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/weather/:city')
  async getWeather(@Param('city') city: string): Promise<any> {
    return this.weatherService.getWeather(city);
  }

  @Get('/weather/:city/forecast/:days')
  async getForecast(@Param('city') city: string, @Param('days') days: number): Promise<any> {
    return this.weatherService.getForecast(city, days);
  }
}
