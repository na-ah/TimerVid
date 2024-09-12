import { Button, Input, Modal } from "@mantine/core";

export default function PlaylistAddVideoModal(props) {
  const {
    addVideoOpened,
    closeAddVideo,
    idInput,
    setIdInput,
    titleInput,
    setTitleInput,
    lengthInput,
    setLengthInput,
    addVideoToPlaylist,
    activePlaylist,
    extractVideoId,
    urlInput,
    setUrlInput,
  } = props;
  return (
    <>
      <Modal
        opened={addVideoOpened}
        onClose={() => {
          closeAddVideo();
          setUrlInput("");
          setIdInput("");
          setLengthInput("");
          setTitleInput("");
        }}
        title="addVideo"
        centered
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addVideoToPlaylist(
              idInput,
              titleInput,
              lengthInput,
              activePlaylist
            );
            setUrlInput("");
            setIdInput("");
            setLengthInput("");
            setTitleInput("");
            closeAddVideo();
          }}
        >
          <Input
            data-autofocus
            placeholder="YoutubeのURLまたは動画IDを入力してください"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              extractVideoId(e.target.value) &&
                setIdInput(extractVideoId(e.target.value));
            }}
          />
          <p>
            {urlInput.length > 0 && idInput.length === 0
              ? "videoIdが抽出できませんでした"
              : "抽出成功: " + idInput}
          </p>
          <br />
          <p>title</p>
          <p> {titleInput}</p>
          <br />
          <p>length</p>
          <p> {lengthInput}</p>
          <br />
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
