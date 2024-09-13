import JoyrideWrapper from "./joyrideWrapper";

const steps = [
  {
    target: "#tutorial4-1",
    content: `作業モードから休憩モードに切り替えます。「skip」ボタンを押してみましょう！skipボタンを押してから次の赤丸に進んでください。`,
  },
  {
    target: "#tutorial4-2",
    content: `休憩用のプレイリストに切り替わりました。次の赤丸に進んでください。`,
  },
  {
    target: "#tutorial2-1",
    content: `休憩用のプレイリストを作成します。「+」ボタンを押してプレイリストを作成後、動画の登録を行ってください。動画の登録が成功したら、次のスライドに進んでください。`,
  },
];

export default function Tutorial4() {
  return (
    <>
      <JoyrideWrapper
        steps={steps}
        title={"休憩時プレイリストの使い方"}
        progress={"1/2"}
        content={
          "TimerVidでは、作業中と休憩で別のプレイリストを使用します。次は休憩時プレイリストを作成してみましょう！\n\n今回は一気に動画登録まで進むので、休憩用の動画のURLまたはID（例：EtqP2xVE4iY）をコピーしておいてください。\n"
        }
        buttonLabel={"④ 休憩時プレイリストの作成方法を知る"}
      />
    </>
  );
}
