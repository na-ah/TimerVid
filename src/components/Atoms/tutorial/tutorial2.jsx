import JoyrideWrapper from "./joyrideWrapper";

const steps = [
  {
    target: "#tutorial2-1",
    content:
      "プレイリストの作成ボタンです。「+」ボタンを押して、あなたの好きな名前のプレイリストを作ってみましょう！プレイリスト作成後は次のスライドに進んでください。",
  },
  {
    target: "#tutorial2-2",
    content: "3つめのステップです",
  },
];

export default function Tutorial2() {
  return (
    <>
      <JoyrideWrapper
        steps={steps}
        title={"プレイリストを作成しよう"}
        progress={"2/2"}
        content={`おめでとうございます！\n\n無事に動画とタイマーが動きました！\n次は自分の好きな動画を登録する方法を学びましょう。`}
        buttonLabel={"② プレイリストの作成方法を知る"}
      />
    </>
  );
}
