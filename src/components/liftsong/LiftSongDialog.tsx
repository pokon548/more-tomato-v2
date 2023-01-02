import { Dialog } from "@headlessui/react";
import ReactPlayer from "react-player/lazy";
import useLocalStorageState from "use-local-storage-state";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLiftSongDialogOpened } from "../../redux/theme/settingSlice";
import useIsServerRender from "../general/ServerRender";

export default function LiftSongDialog() {
  const dialogOpened = useAppSelector(
    (state) => state.setting.liftSongDialogOpened
  );

  const [enableLiftSong] = useLocalStorageState("enableLiftSong", {
    defaultValue: true,
  });

  const playSound = useAppSelector((state) => state.setting.playSound);
  const playSoundVolume = useAppSelector(
    (state) => state.setting.playSoundVolume
  );

  const [liftSongURL, setLifeSongURL] = useLocalStorageState("liftSongURL", {
    defaultValue: "",
  });

  const dispatch = useAppDispatch();

  return (
    <Dialog
      open={true}
      onClose={() => dispatch(setLiftSongDialogOpened(false))}
      className="relative z-50"
    >
      <div
        className={
          dialogOpened
            ? "fixed inset-0 flex items-center justify-center p-4"
            : "hidden"
        }
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="px-4 py-4 w-full max-w-sm rounded bg-white">
            <Dialog.Title className="text-lg font-bold">背景音乐</Dialog.Title>
            <span className="font-light text-sm text-slate-700">
              你可以在这里设置背景音乐。设置好的音频会在专注时自动循环播放。设置自动保存。
              <br />
              注意：你也可以设置视频作为音频来源！请参考{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://cookpete.com/react-player/"
              >
                <span className="text-underline text-blue-400">这里</span>
              </a>{" "}
              以获得受支持的音频源。
            </span>

            <input
              className="w-full border rounded-lg px-2 py-1 my-4"
              onChange={(e) => {
                setLifeSongURL(e.target.value);
              }}
              value={liftSongURL}
              placeholder="输入音频源 URL..."
            ></input>

            <span className="font-light text-sm text-slate-700">
              如果设置正确，你将在下面看到对应音频源的概览：
            </span>

            <div className="playerWrapper pt-4">
              <ReactPlayer
                url={liftSongURL}
                playing={enableLiftSong ? playSound : false}
                controls={!playSound}
                loop={true}
                volume={playSoundVolume}
                width="100%"
              />
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
