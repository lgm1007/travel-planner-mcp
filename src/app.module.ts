import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherController } from './weather/weather.controller';
import { WeatherService } from './weather/weather.service';
import { RpcController } from './rpc/rpc.controller';
import { WeatherModule } from './weather/weather.module';
import { ConfigModule } from '@nestjs/config';
import { AttractionController } from './attraction/attraction.controller';
import { AttractionService } from './attraction/attraction.service';
import { AttractionModule } from './attraction/attraction.module';
import { TripController } from './trip/trip.controller';
import { TripService } from './trip/trip.service';
import { TripModule } from './trip/trip.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), WeatherModule, AttractionModule, TripModule],
  controllers: [AppController, RpcController, AttractionController, TripController],
  providers: [AppService],
})
export class AppModule {}
