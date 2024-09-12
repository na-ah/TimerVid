import { Button, Input, Modal } from "@mantine/core";

export default function PlaylistAddVideoListModal(props) {
  const {
    addVideoListOpened,
    closeAddVideoList,
    playlistInput,
    setPlaylistInput,
    videoIdsInput,
    setVideoIdsInput,
    videoTitlesInput,
    setVideoTitlesInput,
    videoTotalCount,
    videoLengthInput,
    setVideoLengthInput,
    extractPlaylistId,
    urlInput,
    setUrlInput,
    setIdInput,
    addVideoToPlaylist,
    activePlaylist,
  } = props;
  return (
    <>
      <Modal
        opened={addVideoListOpened}
        onClose={() => {
          closeAddVideoList();
          setUrlInput("");
          setIdInput("");
          setVideoIdsInput("");
          setVideoTitlesInput("");
          setVideoLengthInput("");
          setPlaylistInput("");
        }}
        title="addVideoList"
        centered
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            videoIdsInput.forEach((videoId, index) => {
              addVideoToPlaylist(
                videoId,
                videoTitlesInput[index],
                videoLengthInput[index],
                activePlaylist
              );
            });
            setUrlInput("");
            setIdInput("");
            setVideoIdsInput("");
            setVideoTitlesInput("");
            setVideoLengthInput("");
            setPlaylistInput("");
            closeAddVideoList();
          }}
        >
          <Input
            data-autofocus
            placeholder="youtubeの再生リストのURLを入力してください"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              extractPlaylistId(e.target.value) &&
                setPlaylistInput(extractPlaylistId(e.target.value));
            }}
          />
          <p>
            {urlInput.length > 0 && playlistInput.length === 0
              ? "再生リストが抽出できませんでした"
              : "抽出成功: " + playlistInput}
          </p>
          {videoIdsInput && (
            <>
              {/* <p className="text-2xl">ids</p>
              <ul>
                {videoIdsInput?.map((videoId) => (
                  <li key={videoId}>{videoId}</li>
                ))}
              </ul> */}
              <p className="text-2xl mt-3 mb-2">titles</p>
              <ul>
                {videoTitlesInput.map((videoTitle, i) => (
                  <li key={i}>{videoTitle}</li>
                ))}
              </ul>
              {/* <p className="text-2xl">length</p>
              {videoLengthInput?.map((videoLength) => (
                <li key={videoLength}>{videoLength}</li>
              ))} */}

              {/* <p>videoIdsCount: {videoIdsInput.length}</p> */}
              <p>totalVideoCount: {videoTotalCount}</p>
            </>
          )}
          <Button
            className="ml-auto block mt-3"
            type="submit"
          >
            追加
          </Button>
        </form>
      </Modal>
    </>
  );
}
