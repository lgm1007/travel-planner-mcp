import { Body, Controller, Post } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { AttractionService } from '../attraction/attraction.service';
import { TripService } from '../trip/trip.service';

@Controller()
export class RpcController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly attractionService: AttractionService,
    private readonly tripService: TripService,
  ) {}

  /**
   * JSON-RPC 스타일, MCP에서 RPC 호출하여 사용
   * POST /rpc
   * @param body
   */
  @Post('rpc')
  async handleRpc(@Body() body: any) {
    const { jsonrpc, method, params, id } = body;

    /*
     * JSON-RPC 2.0 에러 코드 스펙
     * -32600: Invalid Request (요청 구조가 잘못됨)
     * -32601: Method not found (지원하지 않는 메서드)
     * -32602: Invalid params (파라미터 잘못됨, 스펙에 있음)
     * -32603: Internal error (서버 내부 오류)
     */

    if (jsonrpc !== '2.0') {
      return { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id };
    }

    try {
      switch (method) {
        case 'discover': // MCP Client가 discover를 호출하면 툴 목록을 JSON-RPC 형식으로 응답
          return {
            jsonrpc: '2.0',
            result: {
              tools: [
                {
                  name: 'getWeather',
                  description: '도시 이름을 받아 현재 날씨를 반환합니다.',
                  input: {
                    type: 'object',
                    properties: {
                      city: { type: 'string', description: '도시 이름 (예: seoul, tokyo)' }
                    },
                    required: ['city']
                  }
                },
                {
                  name: 'getForecast',
                  description: '도시 이름과 일 수를 받아 도시별 일기예보를 반환합니다. (최대 5일)',
                  input: {
                    type: 'object',
                    properties: {
                      city: { type: 'string', description: '도시 이름 (예: seoul, tokyo)' },
                      days: { type: 'number', description: '일 수 (최대 5, 최소 1)' }
                    },
                    required: ['city', 'days']
                  }
                },
                {
                  name: 'getAttractions',
                  description: '도시 이름과 최대 조회 개수값을 받아 도시의 관광지를 특정 개수만큼 반환합니다.',
                  input: {
                    type: 'object',
                    properties: {
                      city: { type: 'string', description: '도시 이름 (예: seoul, tokyo)' },
                      limit: { type: 'number', description: '최대 조회 개수' }
                    },
                    required: ['city', 'limit']
                  }
                },
                {
                  name: 'planTrip',
                  description: '도시 이름과 일 수를 받아 날짜별로 도시의 관광지 정보와 날씨 요약 정보를 반환합니다.',
                  input: {
                    type: 'object',
                    properties: {
                      city: { type: 'string', description: '도시 이름 (예: seoul, tokyo)' },
                      days: { type: 'number', description: '일 수 (최대 5, 최소 1)' }
                    },
                    required: ['city', 'days']
                  }
                },
              ]
            },
            id
          };
        case 'getWeather':
          const weather = await this.weatherService.getWeather(params.city);
          return { jsonrpc: '2.0', result: weather, id };
        case 'getForecast':
          const forecast = await this.weatherService.getForecast(params.city, params.days);
          return { jsonrpc: '2.0', result: forecast, id };
        case 'getAttractions':
          const attractions = await this.attractionService.getAttractions(params.city, params.limit || 10);
          return { jsonrpc: '2.0', result: attractions, id };
        case 'planTrip':
          const trip = await this.tripService.planTrip(params.city, params.days);
          return { jsonrpc: '2.0', result: trip, id };
        default:
          return { jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id };
      }
    } catch (error) {
      return { jsonrpc: '2.0', error: { code: -32603, message: error.message }, id };
    }
  }
}
