import { Body, Controller, Post } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';

@Controller()
export class RpcController {
  constructor(private readonly weatherService: WeatherService) {}

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
        case 'getWeather':
          const weather = await this.weatherService.getWeather(params.city);
          return { jsonrpc: '2.0', result: weather, id };
        default:
          return { jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id };
      }
    } catch (error) {
      return { jsonrpc: '2.0', error: { code: -32603, message: error.message }, id };
    }
  }
}
