export default function PlaylistInfo(props) {
  const { currentVideoTitle } = props;
  return (
    <>
      <h1 className="text-xl md:text-2xl">{currentVideoTitle}</h1>
    </>
  );
}
