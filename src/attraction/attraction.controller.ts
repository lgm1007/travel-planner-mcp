import { Controller, Get, Param } from '@nestjs/common';
import { AttractionService } from './attraction.service';

@Controller()
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) {}

  @Get('/attractions/:city/limit/:limit')
  async getAttractions(@Param('city') city: string, @Param('limit') limit: number): Promise<any> {
    return this.attractionService.getAttractions(city, limit);
  }
}
