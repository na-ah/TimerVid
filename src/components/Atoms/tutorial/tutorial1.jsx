import JoyrideWrapper from "./joyrideWrapper";

const steps = [
  {
    target: "#tutorial1-1",
    content: `タイマーと動画の再生／一時停止ボタンです。「play / pause」を押してみましょう！押した後は上部に戻って次のスライドに進んでください！`,
  },
];

export default function Tutorial1() {
  return (
    <>
      <JoyrideWrapper
        steps={steps}
        title={"TimerVidへようこそ!"}
        progress={"1/6"}
        content={
          "Youtubeの音楽や動画と一緒に、楽しく作業しましょう。\nポモドーロテクニックで、驚異的な集中が可能。\n作業時間と休憩時間を区切って、メリハリのある学習を。\n\nそれでは下のボタンを押して使い方を見ていきましょう！\n"
        }
        buttonLabel={"① 動画とタイマーの開始方法を知る"}
      />
    </>
  );
}
