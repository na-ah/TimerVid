import { Button, TextInput, Modal, Stack } from "@mantine/core";

export default function PlaylistAddModal(props) {
  const {
    addNewPlaylist,
    addPlaylistOpened,
    closeAddPlaylist,
    newPlaylist,
    setNewPlaylist,
  } = props;
  
  const isSubmitDisabled = newPlaylist.trim().length === 0;

  return (
    <>
      <Modal
        opened={addPlaylistOpened}
        onClose={() => {
          closeAddPlaylist();
          setNewPlaylist("");
        }}
        title={<span className="font-bold text-lg">新しいプレイリストを追加</span>}
        centered
        overlayProps={{ blur: 3 }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isSubmitDisabled) return;
            addNewPlaylist(newPlaylist);
            closeAddPlaylist();
            setNewPlaylist("");
          }}
        >
          <Stack spacing="md">
            <TextInput
              data-autofocus
              label="プレイリスト名"
              placeholder="例: 集中BGMリスト"
              value={newPlaylist}
              onChange={(e) => setNewPlaylist(e.target.value)}
              required
            />
            <Button
              className="ml-auto"
              type="submit"
              disabled={isSubmitDisabled}
              variant="filled"
            >
              プレイリストを作成
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
