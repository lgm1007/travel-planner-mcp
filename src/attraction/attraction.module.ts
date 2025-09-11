import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AttractionController } from './attraction.controller';
import { AttractionService } from './attraction.service';

@Module({
  imports: [HttpModule],
  controllers: [AttractionController],
  providers: [AttractionService],
  exports: [AttractionService],
})
export class AttractionModule {}
