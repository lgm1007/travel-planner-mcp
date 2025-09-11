import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AttractionService {
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>('GEOAPIFY_API_KEY') ?? '';
  }

  /**
   * 도시의 관광지 조회
   * @param city
   * @param limit
   */
  async getAttractions(city: string, limit: number): Promise<any> {
    try {
      // 1. 도시명 → 좌표 변환
      const geocodeUrl = `https://api.geoapify.com/v1/geocode/search`;
      const geocodeResponse = await lastValueFrom(
        this.http.get(geocodeUrl, {
          params: { text: city, apiKey: this.apiKey },
        }),
      );

      if (!geocodeResponse.data.features?.length) {
        return { error: `No coordinates found for ${city}` };
      }

      const { lat, lon } = geocodeResponse.data.features[0].properties;

      // 2. 관광지 조회
      const placesUrl = `https://api.geoapify.com/v2/places`;
      const placesResponse = await lastValueFrom(
        this.http.get(placesUrl, {
          params: {
            categories: 'tourism.sights,tourism.attraction',
            filter: `circle:${lon},${lat},5000`, // 반경 5km
            limit, // 최대 개수
            apiKey: this.apiKey,
          },
        }),
      );

      const attractions = placesResponse.data.features.map((place: any) => ({
        name: place.properties.name,
        category: place.properties.category,
        address: place.properties.address_line1 || '',
        distance: place.properties.distance || null,
      }));

      return {
        city,
        attractions,
        source: 'Geoapify - Geocode, Places API'
      };

    } catch (error) {
      return {
        error: 'Failed to fetch attractions',
        details: error.response?.data || error.message,
      };
    }
  }
}
