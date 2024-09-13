import { Button } from "@mantine/core";

export default function Tutorial6({ setIsShowTutorial }) {
  return (
    <>
      <div className="p-3 flex flex-col h-full justify-between">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold my-3">TimerVidで快適な学習環境を！</p>
          <p>6/6</p>
        </div>
        <div className="flex-grow leading-loose whitespace-pre-wrap">
          <p>やりました！すべてのチュートリアルが完了しました！</p>
          <br />
          <p>
            今回紹介した機能のほかにも、タイマーの時間やループ回数を細かく調整する機能がありますので、是非いろいろ試してみてくださいね。
          </p>
          <br />
          <p>TimerVidはあなたの目標達成を応援しています！</p>
        </div>
        <Button
          className="w-full mt-8"
          color="black"
          onClick={() => setIsShowTutorial(false)}
        >
          チュートリアルを完了する
        </Button>
      </div>
    </>
  );
}
