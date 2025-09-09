import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherController } from './weather/weather.controller';
import { WeatherService } from './weather/weather.service';
import { RpcController } from './rpc/rpc.controller';

@Module({
  imports: [],
  controllers: [AppController, WeatherController, RpcController],
  providers: [AppService, WeatherService],
})
export class AppModule {}
