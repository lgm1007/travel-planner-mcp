import { Controller, Get, Param } from '@nestjs/common';
import { TripService } from './trip.service';

@Controller()
export class TripController {
  constructor(
    private readonly tripService: TripService
  ) {}

  @Get('/trip/:city/days/:days')
  async planTrip(@Param('city') city: string, @Param('days') days: number): Promise<any> {
    return this.tripService.planTrip(city, days);
  }
}
