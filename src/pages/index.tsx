import { useTranslations } from "next-intl";
import Head from "next/head";
import { useAppSelector } from "../redux/hooks";

import { CiTimer, CiCloud, CiSettings } from "react-icons/ci";
import { HiChevronDown, HiCheck } from "react-icons/hi";
import { IconContext } from "react-icons";

import useSWR, { Key, Fetcher, SWRConfig, useSWRConfig } from "swr";

import Link from "next/link";
import { Fragment, useState } from "react";
import { Dialog, Listbox, Switch, Transition } from "@headlessui/react";
import useLocalStorageState from "use-local-storage-state";

export default function Home() {
  const t = useTranslations("Home");
  const gt = useTranslations("Global");

  const themeType = useAppSelector((state) => state.theme.type);

  const { data, error } = useSWR<string>(
    "https://v1.jinrishici.com/rensheng/lizhi.txt"
  );

  let [isOpenSettings, setIsOpenSettings] = useState(false);

  /* 设置区域
   * TODO: 迁移到单独的组件页面里
   */

  const [useUnsplash, setUseUnsplash] = useLocalStorageState("useUnsplash", {
    defaultValue: true,
  });

  const colorOptions = [
    { name: gt("color_blue"), index: 0 },
    { name: gt("color_amber"), index: 1 },
    { name: gt("color_fuchsia"), index: 2 },
    { name: gt("color_rose"), index: 3 },
  ];

  const [selectedColor, setSelectedColor] = useLocalStorageState(
    "colorOption",
    {
      defaultValue: colorOptions[0],
    }
  );

  return (
    <>
      <Head>
        <title>{t("title_head")}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dialog
        open={isOpenSettings}
        onClose={() => setIsOpenSettings(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="px-4 py-4 w-full max-w-sm rounded bg-white">
            <Dialog.Title className="text-lg font-bold">设置</Dialog.Title>
            <div className="flex flex-col settings-area pt-4 gap-y-4">
              <div className="flex setting-item">
                <div className="flex flex-col setting-description">
                  <span className="font-medium">
                    使用来自 Unsplash 的自然壁纸
                  </span>
                  <span className="font-light text-sm text-slate-700">
                    背景会被替换为 Unsplash
                    的随机自然背景图，而不是默认的纯色渐变效果
                  </span>
                </div>
                <div className="pl-4 flex items-center setting-switch">
                  <Switch
                    checked={useUnsplash}
                    onChange={setUseUnsplash}
                    className={`${useUnsplash ? "bg-teal-900" : "bg-teal-700"}
          relative inline-flex h-[24px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        useUnsplash ? "translate-x-7" : "translate-x-0"
                      }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>
              </div>
              <div className="flex setting-item">
                <div className="flex flex-col setting-description">
                  <span className="font-medium">背景颜色</span>
                  <span className="font-light text-sm text-slate-700">
                    设置番茄钟在非休息时间的背景色
                    <span className="text-slate-400">
                      <br />
                      该选项仅在您关闭了 Unsplash 背景图时才起作用
                    </span>
                  </span>
                </div>
                <div className="pl-4 flex items-center setting-switch grow justify-end">
                  <Listbox value={selectedColor} onChange={setSelectedColor}>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left ring-1 ring-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">
                          {colorOptions[selectedColor.index].name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <HiChevronDown
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {colorOptions.map((color, colorIdx) => (
                            <Listbox.Option
                              key={colorIdx}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-3 pr-4 ${
                                  active
                                    ? "bg-amber-100 text-amber-900"
                                    : "text-gray-900"
                                }`
                              }
                              value={color}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {color.name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                      <HiCheck
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <div
        className={
          useUnsplash
            ? "bg-main-unsplash bg-center bg-cover h-screen"
            : selectedColor.index == colorOptions[0].index
            ? "bg-main-blue bg-center bg-cover h-screen"
            : selectedColor.index == colorOptions[1].index
            ? "bg-main-amber bg-center bg-cover h-screen"
            : selectedColor.index == colorOptions[2].index
            ? "bg-main-fuchsia bg-center bg-cover h-screen"
            : "bg-main-rose bg-center bg-cover h-screen"
        }
      >
        <main
          className={
            useUnsplash
              ? "backdrop-brightness-65 h-full w-full"
              : "h-full w-full"
          }
        >
          <div className="flex flex-col h-full">
            <div className="flex px-8 md:pl-10 lg:pl-12 pt-10 md:pt-12 lg:pt-14">
              <h1 className="text-4xl font-bold text-white">
                {t("title_head")}
              </h1>
              <div className="text-white">Beta</div>
              <div className="grow flex justify-end">
                <button onClick={() => setIsOpenSettings(true)}>
                  <IconContext.Provider
                    value={{ color: "white", size: "2rem" }}
                  >
                    <CiSettings />
                  </IconContext.Provider>
                </button>
              </div>
            </div>
            <div className="text-xl text-slate-200 pl-8 md:pl-10 lg:pl-12 pt-2">
              {error || !data ? "" : data}
            </div>
            <div className="flex h-full gap-x-64 gap-y-4 justify-center items-center">
              <div className="bottomArea">
                <Link href="/tomato">
                  <button className="bg-white/40 px-8 py-8 rounded-full">
                    <IconContext.Provider
                      value={{ color: "white", size: "2rem" }}
                    >
                      <CiTimer />
                    </IconContext.Provider>
                  </button>
                </Link>
                <div className="text-white/80 text-center pt-4 text-lg">
                  {t("pomodoro")}
                </div>
              </div>
              <div className="bottomArea">
                <button className="bg-white/40 px-8 py-8 rounded-full">
                  <IconContext.Provider
                    value={{ color: "white", size: "2rem" }}
                  >
                    <CiCloud />
                  </IconContext.Provider>
                </button>
                <div className="text-white/80 text-center pt-4 text-lg">
                  {t("breathe")}
                </div>
              </div>
              <div className="bottomArea">
                <button className="bg-white/40 px-8 py-8 rounded-full">
                  <IconContext.Provider
                    value={{ color: "white", size: "2rem" }}
                  >
                    <CiSettings />
                  </IconContext.Provider>
                </button>
                <div className="text-white/80 text-center pt-4 text-lg">
                  {t("settings")}
                </div>
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
