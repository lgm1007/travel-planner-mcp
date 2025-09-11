# ✈️ Travel Planner MCP

여행 플래너 MCP는 **Model Context Protocol (MCP)** 기반의 NestJS 서버로,  
ChatGPT와 직접 연동하여 사용자가 원하는 도시와 일정에 맞는 **여행 계획**을 자동으로 생성해주는 프로젝트입니다. 

오픈 API를 활용하여 **날씨 정보, 관광지 추천** 등을 제공하고,  
최종적으로 ChatGPT 대화 안에서 바로 일정을 확인할 수 있습니다.

---

## 🛠 Tech Stack
- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Language**: Node.js (>=18.x)
- **Package Manager**: pnpm
- **Protocol**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- **APIs**: OpenWeather, Geoapify

---

## 🚀 Getting Started
### 1. Clone the repository
```bash
git clone https://github.com/lgm1007/travel-planner-mcp.git
cd travel-planner-mcp
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Environment variables
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
OPENWEATHER_API_KEY=your_openweather_api_key
GEOAPIFY_API_KEY=your_opentripmap_api_key
PORT=3000
```

### 4. Run the server

```bash
pnpm run start:dev
```

서버 실행 후:

```bash
http://localhost:3000
```

---

## 📖 Usage (MCP 연결)
ChatGPT (MCP 지원 버전)에서 이 서버를 등록하면,  
planTrip, getWeather, getAttractions 같은 MCP 툴을 사용할 수 있습니다.

예시:

```bash
"서울에서 3일간 여행 일정 짜줘"
```

👉 ChatGPT가 MCP 서버에 요청

---

## 📄 License
MIT License
