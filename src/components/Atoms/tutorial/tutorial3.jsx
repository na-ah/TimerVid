import JoyrideWrapper from "./joyrideWrapper";

const steps = [
  {
    target: "#tutorial3-1",
    content:
      "プレイリストへ動画を追加するボタンです。「+」ボタンを押して、動画を追加してみましょう！追加後は次のスライドに進んでください。",
  },
];

export default function Tutorial3() {
  return (
    <>
      <JoyrideWrapper
        steps={steps}
        title={"プレイリストに動画を追加しよう"}
        progress={"3/6"}
        content={`Good！プレイリストが作成できました！\n\n次はプレイリストに好きな動画を登録してみましょう。\nYoutubeから動画のURLまたは、動画ID（例：HT6q8GqDHPA）をコピーしておいてください。`}
        buttonLabel={"③ 動画の追加方法を知る"}
      />
    </>
  );
}
