import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { Duration } from "luxon";
import { useEffect, useState } from "react";

export default function usePlaylist(mode) {
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlistInput, setPlaylistInput] = useState("");
  const [videoIdsInput, setVideoIdsInput] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoTitlesInput, setVideoTitlesInput] = useState([]);
  const [videoTotalCount, setVideoTotalCount] = useState(null);
  const [videoLengthInput, setVideoLengthInput] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [idInput, setIdInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [lengthInput, setLengthInput] = useState("");
  const [newPlaylist, setNewPlaylist] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState(
    mode === "work" ? "dbVH6bUT2I8" : "zFbKyU0Hh_8"
  );
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [activePlaylist, setActivePlaylist] = useState(null);

  const [addVideoOpened, { open: openAddVideo, close: closeAddVideo }] =
    useDisclosure(false);

  const [
    addVideoListOpened,
    { open: openAddVideoList, close: closeAddVideoList },
  ] = useDisclosure(false);

  const [
    addPlaylistOpened,
    { open: openAddPlaylist, close: closeAddPlaylist },
  ] = useDisclosure(false);

  // localStorageから読み込み
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVideos = localStorage.getItem(`${mode}-videos`);
      const storedPlaylists = localStorage.getItem(`${mode}-playlists`);

      if (storedVideos) {
        const parsedVideos = JSON.parse(storedVideos);
        setVideos(parsedVideos);
      }
      if (storedPlaylists) {
        const parsedPlaylists = JSON.parse(storedPlaylists);
        setPlaylists(parsedPlaylists);

        if (parsedPlaylists.length > 0) {
          setCurrentVideoId(parsedPlaylists[0]?.videoIds[0] || null);
          setActivePlaylist(parsedPlaylists[0]?.title || null);
        }
      }
      setIsLoaded(true);
    }
  }, [mode]);

  useEffect(() => {
    if (!currentVideoId || videos.length === 0) return;
    const initialVideo = videos.find((video) => video.id === currentVideoId);
    if (initialVideo) {
      setCurrentVideoTitle(initialVideo.title);
    }
  }, [currentVideoId, videos]);

  // localStorageに追記
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(`${mode}-videos`, JSON.stringify(videos));
    }
  }, [mode, isLoaded, videos]);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(`${mode}-playlists`, JSON.stringify(playlists));
    }
  }, [mode, isLoaded, playlists]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState("");

  useEffect(() => {
    const playlist = playlists.find(
      (playlist) => playlist.title === activePlaylist
    );

    const videoIndex = playlist?.videoIds.indexOf(currentVideoId);

    setCurrentVideoIndex(videoIndex);
  }, [currentVideoId, activePlaylist, playlists]);

  useEffect(() => {
    setCurrentVideoIndex(0);
  }, [activePlaylist]);

  const nextVideo = () => {
    if (!activePlaylist) return;
    const playlist = playlists.find(
      (playlist) => playlist.title === activePlaylist
    );

    const videoIdsLength = playlist.videoIds.length;

    setCurrentVideoIndex((prev) => {
      const newVideoIndex = videoIdsLength > prev + 1 ? prev + 1 : 0;
      const videoId = playlist.videoIds[newVideoIndex];

      if (videoIdsLength === 1) {
        setCurrentVideoId(null);
        setTimeout(() => setCurrentVideoId(videoId), 0);
      } else {
        setCurrentVideoId(videoId);
      }

      return newVideoIndex;
    });
  };

  const prevVideo = () => {
    if (!activePlaylist) return;
    const playlist = playlists.find(
      (playlist) => playlist.title === activePlaylist
    );

    const videoIdsLength = playlist.videoIds.length;

    setCurrentVideoIndex((prev) => {
      const newVideoIndex = prev === 0 ? videoIdsLength - 1 : prev - 1;
      const videoId = playlist.videoIds[newVideoIndex];
      setCurrentVideoId(videoId);
      return newVideoIndex;
    });
  };

  const addVideo = (videoId, title, length) => {
    setVideos((prevVideos) => {
      if (prevVideos.find((video) => video.id === videoId)) return prevVideos;
      const newVideo = {
        id: videoId,
        title: title,
        length: length,
      };
      return [...prevVideos, newVideo];
    });
  };

  const addVideoToPlaylist = (videoId, title, length, playlistTitle) => {
    if (videoId === "") return;
    addVideo(videoId, title, length);

    setPlaylists((prevPlaylists) => {
      const playlist = prevPlaylists.find(
        (playlist) => playlist.title === playlistTitle
      );
      if (!playlist) return;

      const newPlaylist = {
        ...playlist,
        videoIds: [...playlist.videoIds, videoId],
      };

      return prevPlaylists.map((playlist) =>
        playlist.title === playlistTitle ? newPlaylist : playlist
      );
    });
  };

  const extractVideoId = (url) => {
    if (url.length === 11) {
      return url;
    }

    const r = /watch\?v=([a-zA-Z0-9_-]{11})/;
    const result = url.match(r);
    if (result !== null) {
      return result[1];
    } else {
      return false;
    }
  };

  const extractPlaylistId = (url) => {
    if (url.length === 34) {
      return url;
    }

    const r = /list=([a-zA-Z0-9_-]+)/;
    const result = url.match(r);
    if (result !== null) {
      return result[1];
    } else {
      return false;
    }
  };

  useEffect(() => {
    const fetchVideoData = async (idInput) => {
      if (idInput) {
        const title = await getTitle(idInput);
        const length = await getLength(idInput);
        setTitleInput(title);
        setLengthInput(length);
      }
    };
    fetchVideoData(idInput);
  }, [idInput]);

  useEffect(() => {
    const fetchVideoLengths = async () => {
      const videoLength = [];

      const fetchVideoData = async (videoId) => {
        if (videoId) {
          const length = await getLength(videoId);
          return length;
        }
        return null;
      };

      const lengthPromises =
        videoIdsInput &&
        videoIdsInput.map((videoId) => fetchVideoData(videoId));

      const lengths = await Promise.all(lengthPromises);

      lengths.forEach((length) => {
        if (length !== null) {
          videoLength.push(length);
        }
      });
      setVideoLengthInput([...videoLength]);
    };
    fetchVideoLengths();
  }, [videoIdsInput]);

  useEffect(() => {
    if (playlistInput == "") return;
    const fetchVideoData = async (playlistInput) => {
      if (playlistInput) {
        const results = await getVideoIds(playlistInput);
        setVideoIdsInput(results.videoIds);
        setVideoTitlesInput(results.videoTitles);
        setVideoTotalCount(results.totalResults);
      }
    };
    fetchVideoData(playlistInput);
  }, [playlistInput]);

  const getVideoIds = async (playlistId) => {
    let nextPageToken = "";
    let resultIds = [];
    let resultTitles = [];
    let resultTotalCount = [];
    const maxPages = 5;

    for (let i = 0; i < maxPages; i++) {
      const config = {
        url: `${process.env.NEXT_PUBLIC_GOOGLE_YOUTUBE_API}/playlistItems`,
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        params: {
          part: "snippet",
          playlistId: playlistId,
          pageToken: nextPageToken,
          maxResults: 50,
          key: `${process.env.NEXT_PUBLIC_GOOGLE_YOUTUBE_API_KEY}`,
        },
      };

      try {
        const res = await axios(config);

        resultIds = [
          ...resultIds,
          ...res.data.items.map((item) => item.snippet.resourceId.videoId),
        ];
        resultTitles = [
          ...resultTitles,
          ...res.data.items.map((item) => item.snippet.title),
        ];
        resultTotalCount = res.data.pageInfo.totalResults;
        if (!res.data.nextPageToken) {
          break;
        }

        nextPageToken = res.data.nextPageToken;
      } catch (error) {
        console.error("error fetching video ids: ", error);
        break;
      }
    }
    return {
      videoIds: resultIds,
      videoTitles: resultTitles,
      totalResults: resultTotalCount,
    };
  };

  const getTitle = async (id) => {
    const config = {
      url: `${process.env.NEXT_PUBLIC_GOOGLE_YOUTUBE_API}/videos`,
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      params: {
        part: "snippet",
        id: id,
        maxResults: 1,
        key: `${process.env.NEXT_PUBLIC_GOOGLE_YOUTUBE_API_KEY}`,
      },
    };
    const res = await axios(config);
    return res.data.items[0].snippet.title;
  };

  const getLength = async (id) => {
    const config = {
      url: `${process.env.NEXT_PUBLIC_GOOGLE_YOUTUBE_API}/videos`,
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      params: {
        part: "contentDetails",
        id: id,
        maxResults: 1,
        key: `${process.env.NEXT_PUBLIC_GOOGLE_YOUTUBE_API_KEY}`,
      },
    };
    const res = await axios(config);
    const duration = Duration.fromISO(
      res.data.items[0].contentDetails.duration
    );

    if (duration.hours === 0) {
      return duration.toFormat("m:ss");
    }

    return duration.toFormat("h:mm:ss");
  };

  const addNewPlaylist = (newPlaylistName) => {
    if (newPlaylistName === "") return;
    setPlaylists([
      ...playlists,
      {
        title: newPlaylistName,
        videoIds: [],
      },
    ]);
    setActivePlaylist(newPlaylistName);
  };

  const removePlaylist = () => {
    const newPlaylist = playlists.filter(
      (playlist) => playlist.title !== activePlaylist
    );
    setPlaylists(newPlaylist);
    if (playlists.length > 1) {
      setActivePlaylist(playlists.at(-2).title);
    }
  };

  return {
    playlists,
    videos,
    currentVideoId,
    setCurrentVideoId,
    currentVideoTitle,
    activePlaylist,
    setActivePlaylist,
    addVideoToPlaylist,
    addVideoOpened,
    openAddVideo,
    closeAddVideo,
    addVideoListOpened,
    openAddVideoList,
    closeAddVideoList,
    playlistInput,
    setPlaylistInput,
    videoIdsInput,
    setVideoIdsInput,
    videoTitlesInput,
    setVideoTitlesInput,
    videoTotalCount,
    setVideoTotalCount,
    videoLengthInput,
    setVideoLengthInput,
    urlInput,
    setUrlInput,
    idInput,
    setIdInput,
    titleInput,
    setTitleInput,
    lengthInput,
    setLengthInput,
    currentVideoIndex,
    nextVideo,
    prevVideo,
    extractVideoId,
    extractPlaylistId,
    addNewPlaylist,
    removePlaylist,
    addPlaylistOpened,
    openAddPlaylist,
    closeAddPlaylist,
    newPlaylist,
    setNewPlaylist,
  };
}
