import { Button, Input, Modal } from "@mantine/core";

export default function PlaylistAddModal(props) {
  const {
    addNewPlaylist,
    addPlaylistOpened,
    closeAddPlaylist,
    newPlaylist,
    setNewPlaylist,
  } = props;
  return (
    <>
      <Modal
        opened={addPlaylistOpened}
        onClose={() => {
          closeAddPlaylist();
          setNewPlaylist("");
        }}
        title="addNewPlaylist"
        centered
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewPlaylist(newPlaylist);
            closeAddPlaylist();
            setNewPlaylist("");
          }}
        >
          <Input
            data-autofocus
            placeholder="プレイリストの名前を入力してください"
            value={newPlaylist}
            onChange={(e) => {
              setNewPlaylist(e.target.value);
            }}
          />
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
