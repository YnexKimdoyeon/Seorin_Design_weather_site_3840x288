"use server";

import { getNaverWeeklyWeather } from "@/utils/getWeather";

export type WeatherStatus =
  | "맑음"
  | "구름조금"
  | "비"
  | "눈"
  | "구름많음"
  | "흐림"
  | "소나기"
  | "로딩중"
  | "기타";
export interface WeatherCondition {
  background: string; // 배경 이미지 파일 이름
  icon: string; // 아이콘 이미지 경로
}

export interface TempObject {
  minTemp: number;
  maxTemp: number; 
  curTemp: number | null
}

export interface WeatherData {
  date: string; // 날짜 (e.g., "19일(화)")
  temp: TempObject; // 온도 (섭씨)
  hu: number; // ! 강수 확률 (%), 사실 습도임
  wind: number; // 풍속 (m/s)
  status: { // 날씨 상태
    am: WeatherStatus; 
    pm: WeatherStatus;
    cur: WeatherStatus | null;
  }
}

export const getDataAction = async () => {
  try {
    const weeklyWeather = await getNaverWeeklyWeather();
    // console.log(weeklyWeather);
    return {ok: true, result: weeklyWeather};
  } catch (error) {
    console.error("Error occurred while fetching weekly weather:", error);
    // 에러 발생 시 기본값을 반환하거나 추가 처리
    return {
      ok: false,
      message: "Failed to fetch weekly weather data",
    };
  }
};

