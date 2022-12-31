import { useTranslations } from "next-intl";
import Head from "next/head";
import { useAppSelector, useAppDispatch } from "../redux/hooks";

import { CiCircleChevLeft, CiPlay1, CiPause1 } from "react-icons/ci";
import { IconContext } from "react-icons";
import Link from "next/link";

import moment from "moment";

import useLocalStorageState from "use-local-storage-state";
import {
  startWorkClock,
  interruptWorkClock,
  setCurrentTimeInSeconds,
  decreaseCurrentTimeInSeconds,
  pauseClock,
  resumeClock,
  setNextPhase,
  setTookShortRelax,
  startShortRelaxClock,
  startLongRelaxClock,
} from "../redux/theme/clockSlice";

import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player";

import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useRef, useState } from "react";

export default function Tomato() {
  const t = useTranslations("Home");
  const themeType = useAppSelector((state) => state.theme.type);

  const [workingTime, setWorkingTime] = useLocalStorageState("workingTime", {
    defaultValue: 25,
  });
  const [shortRelaxTime, setShortRelaxTime] = useLocalStorageState(
    "shortRelaxTime",
    {
      defaultValue: 5,
    }
  );
  const [longRelaxTime, setLongRelaxTime] = useLocalStorageState(
    "longRelaxTime",
    {
      defaultValue: 15,
    }
  );

  const [dimmingBackground, setDimmingBackground] = useState(false);

  const currentTimeInSeconds = useAppSelector(
    (state) => state.clock.currentTimeInSeconds
  );

  const dispatch = useAppDispatch();

  const inWorkTerm = useAppSelector((state) => state.clock.inWorkTerm);
  const inWorkTermPause = useAppSelector(
    (state) => state.clock.inWorkTermPause
  );
  const inShortTermRelaxing = useAppSelector(
    (state) => state.clock.inShortTermRelaxing
  );
  const inLongTermRelaxing = useAppSelector(
    (state) => state.clock.inLongTermRelaxing
  );
  const inRelaxTermPause = useAppSelector(
    (state) => state.clock.inRelaxTermPause
  );
  const tookShortRelax = useAppSelector((state) => state.clock.tookShortRelax);

  const nextPhase = useAppSelector((state) => state.clock.nextPhase);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(decreaseCurrentTimeInSeconds());
    }, 1000);

    // 如果不在工作状态，就立刻停止计时器
    if (!inWorkTerm || inWorkTermPause) {
      if (!inLongTermRelaxing || inRelaxTermPause) {
        if (!inShortTermRelaxing || inRelaxTermPause) {
          clearInterval(timer);

          setDimmingBackground(false);
        }
      }
    }

    console.log(nextPhase);

    // 如果当前时间已经小于等于 0，终止计时并设置状态
    if (currentTimeInSeconds <= 0) {
      clearInterval(timer);
      setDimmingBackground(false);

      if (inWorkTerm || inLongTermRelaxing || inShortTermRelaxing) {
        const audio = new Audio("/public_alert.wav");
        audio.load();
        audio.play();
      }

      dispatch(interruptWorkClock());
    }

    return () => clearInterval(timer);
  }, [
    inWorkTerm,
    inWorkTermPause,
    inRelaxTermPause,
    currentTimeInSeconds,
    nextPhase,
  ]);

  return (
    <>
      <Head>
        <title>{t("title_head")}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-main-unsplash bg-center bg-cover h-screen">
        <main
          className={
            dimmingBackground
              ? "backdrop-brightness-65 backdrop-blur-md h-full w-full transition-all duration-1000"
              : "backdrop-brightness-65 h-full w-full transition-all duration-1000"
          }
        >
          <div className="flex flex-col h-full">
            <h1
              className={
                dimmingBackground
                  ? "text-4xl font-bold text-slate-400 pl-8 md:pl-10 lg:pl-12 pt-10 md:pt-12 lg:pt-14 transition-all"
                  : "text-4xl font-bold text-white pl-8 md:pl-10 lg:pl-12 pt-10 md:pt-12 lg:pt-14 transition-all"
              }
            >
              <div className="flex">
                {inWorkTerm ||
                inLongTermRelaxing ||
                inShortTermRelaxing ||
                inRelaxTermPause ||
                nextPhase == "short_break" ||
                nextPhase == "long_break" ? (
                  <button
                    onClick={() => {
                      dispatch(interruptWorkClock());
                      dispatch(setCurrentTimeInSeconds(0));
                      dispatch(setNextPhase("work"));

                      setDimmingBackground(false);
                    }}
                  >
                    <IconContext.Provider
                      value={{
                        color: dimmingBackground ? "rgb(148 163 184)" : "white",
                        size: "2.5rem",
                      }}
                    >
                      <CiCircleChevLeft />
                    </IconContext.Provider>
                  </button>
                ) : (
                  <Link href="/">
                    <button>
                      <IconContext.Provider
                        value={{ color: "white", size: "2.5rem" }}
                      >
                        <CiCircleChevLeft />
                      </IconContext.Provider>
                    </button>
                  </Link>
                )}
                <span className="pl-4">
                  {inWorkTerm
                    ? inWorkTermPause
                      ? "暂停专注"
                      : "正在专注"
                    : inShortTermRelaxing || inLongTermRelaxing
                    ? inRelaxTermPause
                      ? "暂停休息"
                      : "正在休息"
                    : nextPhase == "work"
                    ? "开始专注"
                    : nextPhase == "short_break"
                    ? "开始短休息"
                    : "开始长休息"}
                </span>
              </div>
            </h1>
            <div className="flex h-full gap-x-96 gap-y-4 justify-center items-center">
              {inWorkTerm || inShortTermRelaxing || inLongTermRelaxing ? (
                <div className="tomato-clock-running flex">
                  <div className="main-tomato-clock-plate" />
                  <div className="h-52 w-52 sm:w-60 sm:h-60 absolute">
                    <CircularProgressbar
                      value={
                        (1 -
                          currentTimeInSeconds /
                            (inWorkTerm
                              ? workingTime * 60
                              : inShortTermRelaxing
                              ? shortRelaxTime * 60
                              : longRelaxTime * 60)) *
                        100
                      }
                      strokeWidth={1}
                      text={
                        currentTimeInSeconds >= 60 * 60
                          ? `${
                              Math.trunc(currentTimeInSeconds / 60) +
                              moment
                                .utc(currentTimeInSeconds * 1000)
                                .format(" : ss")
                            }`
                          : `${moment
                              .utc(currentTimeInSeconds * 1000)
                              .format("mm : ss")}`
                      }
                      styles={buildStyles({
                        pathColor: "white",
                        textColor: "white",
                        textSize: "text-xl",
                        trailColor: "transparent",
                      })}
                    />
                  </div>
                </div>
              ) : (
                <div className="tomato-clock flex">
                  <div className="main-tomato-clock-plate" />
                  <div className="flex flex-row-reverse absolute h-52 w-52 sm:w-60 sm:h-60">
                    <div className="flex text-sm sm:text-lg items-center text-white align-middle mr-10 sm:mr-9 opacity-70">
                      分钟
                    </div>
                  </div>
                  <input
                    className="main-tomato-clock-input"
                    type="dial"
                    minLength={1}
                    maxLength={3}
                    aria-label="设置工作时间（分钟）"
                    value={
                      nextPhase == "work"
                        ? workingTime
                        : nextPhase == "short_break"
                        ? shortRelaxTime
                        : longRelaxTime
                    }
                    onChange={(e) => {
                      let input = Number(e.target.value);

                      if (nextPhase == "work")
                        setWorkingTime(
                          isNaN(input) || input <= 0 ? NaN : input
                        );
                      else if (nextPhase == "short_break")
                        setShortRelaxTime(
                          isNaN(input) || input <= 0 ? NaN : input
                        );
                      else
                        setLongRelaxTime(
                          isNaN(input) || input <= 0 ? NaN : input
                        );
                    }}
                  />
                </div>
              )}

              <div className="bottomArea flex items-center">
                {inWorkTerm || inLongTermRelaxing || inShortTermRelaxing ? (
                  inWorkTermPause || inRelaxTermPause ? (
                    <button
                      className="bg-white/40 px-8 py-8 rounded-full transition-all"
                      onClick={() => {
                        dispatch(resumeClock());
                        if (inWorkTerm) {
                          setDimmingBackground(true);
                        }
                      }}
                    >
                      <IconContext.Provider
                        value={{ color: "white", size: "2rem" }}
                      >
                        <CiPlay1 />
                      </IconContext.Provider>
                    </button>
                  ) : (
                    <button
                      className={
                        inWorkTerm
                          ? "bg-white/20 px-8 py-8 rounded-full transition-all"
                          : "bg-white/40 px-8 py-8 rounded-full transition-all"
                      }
                      onClick={() => {
                        dispatch(pauseClock(inWorkTerm ? false : true));
                      }}
                    >
                      <IconContext.Provider
                        value={{
                          color: inWorkTerm ? "rgb(148 163 184)" : "white",
                          size: "2rem",
                        }}
                      >
                        <CiPause1 />
                      </IconContext.Provider>
                    </button>
                  )
                ) : (
                  <button
                    className="bg-white/40 px-8 py-8 rounded-full"
                    onClick={() => {
                      isNaN(workingTime) || workingTime <= 0 ? null : null;

                      if (nextPhase == "work") {
                        dispatch(
                          setCurrentTimeInSeconds(Number(workingTime * 60))
                        );
                        setDimmingBackground(true);
                        if (tookShortRelax) {
                          dispatch(setTookShortRelax(false));
                          dispatch(setNextPhase("long_break"));
                        } else {
                          dispatch(setTookShortRelax(true));
                          dispatch(setNextPhase("short_break"));
                        }
                        dispatch(startWorkClock(Number(workingTime * 60)));
                      } else {
                        dispatch(setNextPhase("work"));

                        if (nextPhase == "short_break") {
                          dispatch(
                            setCurrentTimeInSeconds(Number(shortRelaxTime * 60))
                          );
                          dispatch(
                            startShortRelaxClock(Number(shortRelaxTime * 60))
                          );
                        } else {
                          dispatch(
                            setCurrentTimeInSeconds(Number(longRelaxTime * 60))
                          );
                          dispatch(
                            startLongRelaxClock(Number(longRelaxTime * 60))
                          );
                        }
                      }
                    }}
                  >
                    <IconContext.Provider
                      value={{ color: "white", size: "2rem" }}
                    >
                      <CiPlay1 />
                    </IconContext.Provider>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps(context: any) {
  // If you don't use internationalized routing, define this statically.
  const locale = context.locale;

  return {
    props: {
      // You can get the messages from anywhere you like. The recommended
      // pattern is to put them in JSON files separated by language.
      messages: (await import(`../i18n/${locale}.json`)).default,
    },
  };
}
