import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { WeatherService } from '../weather/weather.service';
import { AttractionService } from '../attraction/attraction.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TripController],
  providers: [TripService, WeatherService, AttractionService],
  exports: [TripService]
})
export class TripModule {}
