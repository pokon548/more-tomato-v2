import { Dialog, Listbox, Switch, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import { HiCheck, HiChevronDown } from "react-icons/hi";
import useLocalStorageState from "use-local-storage-state";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setDialogOpened } from "../../redux/theme/settingSlice";
import { colorOptions } from "./SettingsProps";

export default function SettingsDialog() {
  const gt = useTranslations("Global");

  const dialogOpened = useAppSelector((state) => state.setting.dialogOpened);

  const [useUnsplash, setUseUnsplash] = useLocalStorageState("useUnsplash", {
    defaultValue: true,
  });

  const [blurWhenFocusing, setBlurWhenFocusing] = useLocalStorageState(
    "blurWhenFocusing",
    {
      defaultValue: true,
    }
  );

  const [selectedColor, setSelectedColor] = useLocalStorageState(
    "colorOption",
    {
      defaultValue: colorOptions[0],
    }
  );

  const [enableLiftSong, setEnableLiftSong] = useLocalStorageState(
    "enableLiftSong",
    {
      defaultValue: true,
    }
  );

  const dispatch = useAppDispatch();

  return (
    <Dialog
      open={dialogOpened}
      onClose={() => dispatch(setDialogOpened(false))}
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
                  背景会被替换为 Unsplash 的随机自然背景图，而不是纯色渐变效果
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
                        {gt(colorOptions[selectedColor.index].name)}
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
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
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
                                  {gt(color.name)}
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
            <div className="flex setting-item">
              <div className="flex flex-col setting-description">
                <span className="font-medium">在专注时模糊背景图像</span>
                <span className="font-light text-sm text-slate-700">
                  在您处于专注时刻时，番茄钟会自动模糊背景，以减少视觉干扰
                  <span className="text-slate-400">
                    <br />
                    该选项仅在您开启了 Unsplash 背景图时才起作用
                  </span>
                </span>
              </div>
              <div className="pl-4 flex items-center setting-switch">
                <Switch
                  checked={blurWhenFocusing}
                  onChange={setBlurWhenFocusing}
                  className={`${
                    blurWhenFocusing ? "bg-teal-900" : "bg-teal-700"
                  }
          relative inline-flex h-[24px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      blurWhenFocusing ? "translate-x-7" : "translate-x-0"
                    }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </div>
            <div className="flex setting-item">
              <div className="flex flex-col setting-description">
                <span className="font-medium">开启背景音</span>
                <span className="font-light text-sm text-slate-700">
                  在专注时，您可以点击右上角的音乐按钮开启背景音，以增加沉浸感
                </span>
              </div>
              <div className="pl-4 flex items-center setting-switch">
                <Switch
                  checked={enableLiftSong}
                  onChange={setEnableLiftSong}
                  className={`${
                    enableLiftSong ? "bg-teal-900" : "bg-teal-700"
                  }
          relative inline-flex h-[24px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      enableLiftSong ? "translate-x-7" : "translate-x-0"
                    }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
