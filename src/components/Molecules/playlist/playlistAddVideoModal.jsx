import { Button, TextInput, Modal, Stack, Text, Group, Loader, Divider } from "@mantine/core";
import { FaSearch } from "react-icons/fa";

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
    setCurrentVideoId,
    openSearchVideo, // 新しく追加
  } = props;

  // URLが入力されていてIDが抽出できない場合はエラー
  const hasError = urlInput.length > 0 && !idInput;
  // IDが抽出されていて、まだタイトルが取得できていない場合はローディング中
  const isLoading = Boolean(idInput && !titleInput);
  // タイトルが取得できていれば追加可能
  const isSubmitDisabled = !titleInput || hasError;

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
        title={<span className="font-bold text-lg">動画をプレイリストに追加</span>}
        yOffset="10vh"
        overlayProps={{ blur: 3 }}
      >
        <Stack spacing="lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isSubmitDisabled) return;
              addVideoToPlaylist(idInput, titleInput, lengthInput, activePlaylist);
              setCurrentVideoId(idInput);
              setUrlInput("");
              setIdInput("");
              setLengthInput("");
              setTitleInput("");
              closeAddVideo();
            }}
          >
            <Stack spacing="sm">
              <TextInput
                data-autofocus
                label="YouTube URL または 動画ID"
                placeholder="https://www.youtube.com/watch?v=... または https://youtu.be/..."
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  const extracted = extractVideoId(e.target.value);
                  if (extracted) {
                    setIdInput(extracted);
                  } else {
                    setIdInput("");
                  }
                }}
                error={hasError ? "有効なYouTube動画のURLを入力してください" : null}
                description={idInput && !hasError ? `動画ID: ${idInput}` : null}
              />

              {isLoading && (
                <Group position="center" mt="md">
                  <Loader size="sm" />
                  <Text size="sm" color="dimmed">動画情報を取得中...</Text>
                </Group>
              )}

              {titleInput && !isLoading && (
                <div className="bg-slate-100 p-4 rounded-md mt-2">
                  <Text size="sm" weight={600} color="dimmed">動画タイトル</Text>
                  <Text size="md" className="line-clamp-2 leading-tight">{titleInput}</Text>
                  
                  <Text size="sm" weight={600} color="dimmed" mt="xs">再生時間</Text>
                  <Text size="md">{lengthInput || "不明"}</Text>
                </div>
              )}

              <Button
                className="ml-auto mt-2"
                type="submit"
                disabled={isSubmitDisabled}
                loading={isLoading}
              >
                動画を追加
              </Button>
            </Stack>
          </form>

          <Divider label="または" labelPosition="center" />

          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 flex flex-col items-center gap-3 text-center">
            <Text size="sm" color="dimmed">
              追加したい動画のURLがわからない場合は、キーワードで検索して探すことができます。
            </Text>
            <Button
              variant="light"
              color="teal"
              leftSection={<FaSearch />}
              onClick={() => {
                closeAddVideo();
                if (openSearchVideo) openSearchVideo();
              }}
              fullWidth
            >
              YouTubeから動画を検索する
            </Button>
          </div>
        </Stack>
      </Modal>
    </>
  );
}
