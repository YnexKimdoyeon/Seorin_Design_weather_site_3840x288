"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image"; // Next.js Image 컴포넌트
import {
  getDataAction,
  WeatherCondition,
  WeatherData,
  WeatherStatus,
} from "./actions";

// 배경 이미지 및 날씨 데이터 정의
const weatherConditions: Record<WeatherStatus, WeatherCondition> = {
  맑음: {
    background: "b-good2",
    icon: "/images/icons/i-good.png",
  },
  비: {
    background: "b-rain",
    icon: "/images/icons/i-rainbig.png",
  },
  구름많음: {
    background: "b-sad",
    icon: "/images/icons/i-cloudbig.png",
  },
  흐림: {
    background: "b-sad",
    icon: "/images/icons/i-sad.png",
  },
  눈: {
    background: "b-snow",
    icon: "/images/icons/i-snowbig.png",
  },
  구름조금: {
    background: "b-sad",
    icon: "/images/icons/i-cloudsmall.png",
  },
  소나기: {
    background: "b-temprain",
    icon: "/images/icons/i-temprain.png",
  },
  로딩중: {
    background: "b-good2",
    icon: "/images/icons/i-good.png",
  },
  기타: {
    background: "b-good1",
    icon: "/images/icons/i-etc.png",
  },
};

const dummyData: WeatherData = {
  date: "로딩중",
  hu: 0,
  temp: { curTemp: 0, maxTemp: 0, minTemp: 0 },
  status: { am: "맑음", pm: "맑음", cur: "로딩중" },
  wind: 0,
};

const initData = Array(6).fill(null).map(() => dummyData);

export default function Home() {
  const [currentBackground, setCurrentBackground] = useState(
    weatherConditions["맑음"].background
  );
  const [pos] = useState("포항시 북구 양덕동"); // 위치
  const [date, setDate] = useState(""); // 날짜
  const [time, setTime] = useState(""); // 시간
  const [ampm, setAmpm] = useState(""); // AM or PM

  const [data, setData] = useState<WeatherData[]>(initData);
  const [yo, setYo] = useState<string | null>(null);
  const isFirstYo = useRef(true);

  const getData = useCallback(async () => {
    try {
      const response = await getDataAction();
      console.log(response);
      setData(response.result);
    } catch (error) {
      console.error("Error fetching data. Retrying in 5 seconds...", error);
      // 5초 뒤에 다시 시도
      setTimeout(getData, 5000);
    }
  }, [setData]);

  useEffect(() => {
    if (data.length === 0) return;
    const bg = weatherConditions[data[0].status.cur].background;
    setCurrentBackground(bg);
  }, [data]);

  useEffect(() => {
    if (yo === null) return;
    if (isFirstYo.current) {
      isFirstYo.current = false;
      return;
    }

    console.log("요일 바뀜");

    const ids: NodeJS.Timeout[] = [];
    const target_time = [1000 * 60 * 1, 1000 * 60 * 5, 1000 * 60 * 8];

    target_time.forEach((time) => {
      const id = setTimeout(() => {
        getData();
      }, time);
      ids.push(id);
    });

    return () => {
      ids.forEach((id) => {
        clearTimeout(id);
      });
    };
  }, [yo, getData]);

  useEffect(() => {
    // 1시간 마다 업데이트
    getData();
    const interval = setInterval(getData, 1000 * 60 * 60 * 1);

    return () => clearInterval(interval);
  }, [getData]);

  // 날짜 및 시간 형식 설정
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const day = days[now.getDay()]; // 요일
      const formattedDate = `${now.getFullYear()}년 ${
        now.getMonth() + 1
      }월 ${now.getDate()}일 ${day}요일`;

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedTime = `${String(
        hours % 12 === 0 ? 12 : hours % 12
      ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      setDate(formattedDate);
      setTime(formattedTime);
      setAmpm(ampm);
      setYo(day);
    };

    // 초기 업데이트 및 1초마다 업데이트
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (data.length < 6) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="w-[3840px] h-[288px] overflow-x-auto text-white">
      {/* 고정된 배경 영역 */}
      <div
        className="relative w-[3840px] h-[288px]"
        style={{
          backgroundImage: `url(/images/backgrounds/${currentBackground}.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 위치 */}
        <span className="absolute text-[42px] left-[241px] top-[65px]">
          {pos}
        </span>
        {/* 날짜 */}
        <span className="absolute text-[43px] left-[190px] top-[178px]">
          {date}
        </span>
        {/* 시간 */}
        <div className="absolute text-[45px] left-[731px] top-[137px]">
          {ampm}
        </div>
        <div className="absolute text-[120px] left-[811px] top-[64px]">
          {time}
        </div>
        {/* 현재 날씨 */}
        <span className="absolute text-[41px] left-[1500px] top-[18px]">
          {data[0].status.cur}
        </span>
        {/* 아이콘 */}
        <Image
          className="absolute left-[1251px] top-[81px]"
          src={weatherConditions[data[0].status.cur].icon || ""}
          alt={data[0].status.cur}
          width={140}
          height={138}
        />
        {/* 현재 온도 */}
        <span className="absolute left-[1438px] top-[85px] text-[102px]">
          {data[0].temp.curTemp}
        </span>
        {/* 현재 습도 */}
        <span className="absolute left-[1313px] top-[218px] text-[45px] font-light text-right w-[40px]">
          {data[0].hu}
        </span>
        {/* 현재 풍속 */}
        <span className="absolute left-[1570px] top-[218px] text-[45px] font-light text-right w-[40px]">
          {data[0].wind}
        </span>

        {/* 나머지 날씨 파트 */}
        <div className="w-[1150px] h-[288px] absolute left-[2372px] top-[0px] flex flex-row gap-[55px]">
          {data.slice(1).map((v, i) => {
            return (
              <div key={i} className="w-[306px] flex flex-col relative">
                {/* 날짜 */}
                <span className="mt-[20px] text-[35px] w-[300px] left-[-60px] absolute top-[0px] text-center font-[600]">
                  {v.date}
                </span>

                {/* 오전 날씨 아이콘 */}
                <Image
                  className="self-center mt-[18px] absolute top-[65px] left-[10px]"
                  src={weatherConditions[data[i + 1].status.am].icon || ""}
                  alt={data[i + 1].status.am}
                  width={70}
                  height={50}
                />

                {/* 오후 날씨 아이콘 */}
                <Image
                  className="self-center mt-[18px] absolute top-[65px] left-[90px]"
                  src={weatherConditions[data[i + 1].status.pm].icon || ""}
                  alt={data[i + 1].status.pm}
                  width={70}
                  height={50}
                />

                {/* 최소 온도 */}
                <span className="absolute top-[169px] left-[-25px] text-[31px] w-[130px] text-center font-[300]">
                  {v.temp.minTemp}
                </span>

                <span className="absolute top-[169px] left-[50px] text-[31px] w-[130px] text-center font-[300]">
                  {v.temp.maxTemp}
                </span>

                {/* 습도 */}
                <span className="absolute top-[217px] left-[40px] text-[24px] self-center w-[100px] text-center">
                  {v.hu}
                </span>

                {/* 풍속 */}
                <span className="absolute top-[246px] left-[40px] text-[24px] self-center w-[100px] text-center">
                  {v.wind}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
