import { Button, TextInput, Modal, Stack, Text, Group, Loader, ScrollArea, Badge } from "@mantine/core";

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

  const hasError = urlInput.length > 0 && !playlistInput;
  const isLoading = Boolean(playlistInput && (!videoIdsInput || videoIdsInput.length === 0));
  const isSubmitDisabled = !videoIdsInput || videoIdsInput.length === 0 || hasError;

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
        title={<span className="font-bold text-lg">YouTube再生リストから一括追加</span>}
        centered
        size="lg"
        overlayProps={{ blur: 3 }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isSubmitDisabled) return;
            videoIdsInput.forEach((videoId, index) => {
              addVideoToPlaylist(
                videoId,
                videoTitlesInput[index],
                videoLengthInput[index] || "不明",
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
          <Stack spacing="sm">
            <TextInput
              data-autofocus
              label="YouTube 再生リスト(Playlist) URL"
              placeholder="https://www.youtube.com/playlist?list=..."
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                const extracted = extractPlaylistId(e.target.value);
                if (extracted) {
                  setPlaylistInput(extracted);
                } else {
                  setPlaylistInput("");
                }
              }}
              error={hasError ? "有効なYouTube再生リストのURLを入力してください" : null}
              description={playlistInput && !hasError ? `リストID: ${playlistInput}` : null}
            />

            {isLoading && (
              <Group position="center" mt="md">
                <Loader size="sm" />
                <Text size="sm" color="dimmed">再生リストの動画情報を取得中...</Text>
              </Group>
            )}

            {videoIdsInput && videoIdsInput.length > 0 && !isLoading && (
              <div className="bg-slate-50 p-4 rounded-md mt-2 border border-slate-200">
                <Group position="apart" mb="sm">
                  <Text size="sm" weight={600} color="dimmed">取得した動画</Text>
                  <Badge color="blue">合計 {videoTotalCount} 件</Badge>
                </Group>
                
                <ScrollArea h={200} type="always" offsetScrollbars>
                  <Stack spacing="xs">
                    {videoTitlesInput.map((videoTitle, i) => (
                      <div key={i} className="flex gap-2 items-start border-b border-slate-100 pb-2">
                        <Text size="xs" color="dimmed" className="w-6 flex-shrink-0 pt-0.5">{i + 1}.</Text>
                        <Text size="sm" className="line-clamp-2">{videoTitle}</Text>
                      </div>
                    ))}
                  </Stack>
                </ScrollArea>
              </div>
            )}

            <Button
              className="ml-auto mt-2"
              type="submit"
              disabled={isSubmitDisabled}
              loading={isLoading}
            >
              一括追加する
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
