import JoyrideWrapper from "./joyrideWrapper";

const steps = [
  {
    target: "#tutorial5-1",
    content: `Youtubeの再生リストを読み込みます。三本線のアイコンをクリックして、再生リストを追加してみましょう。追加完了後は次のスライドに進んでください。`,
  },
];

export default function Tutorial5() {
  return (
    <>
      <JoyrideWrapper
        steps={steps}
        title={"再生リストをまとめて登録しよう"}
        progress={"5/6"}
        content={
          "お疲れさまでした！\n基本的なTimerVidの使い方を学ぶことができました！\n\n最後に、Youtubeの再生リストを一気に登録する方法を学びましょう。再生リストのURLまたは、再生リストID（例：PLU1XqNAUBP5Vp2fOpaUV3aYa6XwfkL73f）をコピーしておいてください。もう一度skipを押して、workタイマーに移動してから次のボタンを押してください。"
        }
        buttonLabel={"⑤ 再生リストを一気に登録する方法を知る"}
      />
    </>
  );
}
