import { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./App.css";

const oldMImage = new URL("../old m.png", import.meta.url).href;
const songFiles = [
  { title: "A Thousand Years", file: "A Thousand Years-(PagalSongs.Com.IN).mp3" },
  { title: "Little Do You Know", file: "Alex_Sierra_-_Little_Do_You_Know_CeeNaija.com_.mp3" },
  { title: "On Fire", file: "Andy Bumuntu - On Fire (Prod. Flyest music).mp3" },
  { title: "lovely", file: "Billie_Eilish_Khalid_-_lovely_(Naijay.com).mp3" },
  { title: "For My Hand", file: "Burna_Boy_Ft_Ed_Sheeran_-_For_My_Hand.mp3" },
  { title: "Sina Noma", file: "Charisma - Sina Noma.mp3" },
  { title: "Baby Riddim", file: "fave_baby_riddim_official_video_mp3_42725.mp3" },
  { title: "Beautifully", file: "fave_beautifully_official_video_mp3_48921.mp3" },
  { title: "N.B.U (Nobody But You)", file: "fave_nbu_nobody_lyrics_mp3_85078.mp3" },
  { title: "Peer Pressure", file: "James_Bay_feat_Julia_Michaels_-_Peer_Pressure.mp3" },
  { title: "All Over", file: "magixx_all_over_official_audio_mp3_47133.mp3" },
  { title: "Last Name", file: "Nikita-Kering-Last-Name-(TrendyBeatz.com).mp3" },
  { title: "Malaika", file: "nyashinski_malaika_official_music_video_mp3_78578.mp3" },
  { title: "Perfect Design", file: "nyashinski_perfect_design_official_music_video_mp3_27934.mp3" },
  { title: "In My Bed", file: "Rotimi_-_In_My_Bed_feat._Wale_(mp3.pm).mp3" },
  {
    title: "Afrikan Star",
    file: "Sauti-Sol-Ft-Burna-Boy-Afrikan-Star-(TrendyBeatz.com).mp3",
  },
  { title: "Melanin", file: "Sauti-Sol-Ft-Patoranking-Melanin-(TrendyBeatz.com).mp3" },
  { title: "Isabella", file: "Sauti-Sol-Isabella-(TunezJam.com).mp3" },
  { title: "Feel My Love", file: "sauti_sol_feel_my_love_official_audio_mp3_25832.mp3" },
];

const getSongSrc = (file) => `${import.meta.env.BASE_URL}songs/${encodeURIComponent(file)}`;
const songs = songFiles.map((song) => ({
  title: song.title,
  src: getSongSrc(song.file),
}));

const heartColors = [
  "#e83f7e",
  "#ff6b6b",
  "#ff9f1c",
  "#f4d35e",
  "#52b788",
  "#2a9d8f",
  "#00b4d8",
  "#1d4ed8",
  "#6d28d9",
  "#9333ea",
  "#f43f5e",
  "#ef4444",
  "#f97316",
  "#14b8a6",
  "#22c55e",
  "#0ea5e9",
  "#f59e0b",
  "#db2777",
];

const pages = [
  {
    id: 1,
    type: "cover",
    title: "Hi there",
    subtitle: "Click for a surprise",
  },
  {
    id: 2,
    type: "sheet",
    title: "Hello maggie🌸",
    body:
      "This isn’t meant to fix anything.\nIt’s just a quiet moment, made with care.\nHope you like it.",
  },
  {
    id: 3,
    type: "sheet",
    title: "How have you been lately?",
    body: "hope you have been finding joy in the good moments and strength in the hard ones.",
  },
  {
    id: 4,
    type: "sheet",
    title: "we've known each other for a while now.",
    body: "from the times we didn't take life too serious.",
    backImage: oldMImage,
    backImageAlt: "Photo memory",
  },
  {
    id: 5,
    type: "sheet",
    title: "still going strong.",
    body:"to now when life has taken us to different places but we are still here for one another",
  },
  {
    id: 6,
    type: "sheet",
    title: "thank you for always being there.",
    body:
      "in my mind i know that you will always be there when needed.",
  },
  { id: 7,
    type: "sheet",
    title: "you are worth it",
    body:"don't let  anythingoranyone make you feel like you are not worth it or not good enough because you are more than that and you deserve the world and everything in it.",
    
  },
  { id: 8, 
    type: "sheet",
    title: "happy valentines day",
    body:"wishing you a day filled with love and happiness.",
 },
  { id: 9,
     type: "sheet",
     title: "yours truly,",
        body:"nania💖",
    
    },
  {
    id: 10,
    type: "cover back",
    body:
      "bye bye👋",
  },
];

const getBookSize = () => {
  if (typeof window === "undefined") {
    return { width: 360, height: 520 };
  }
  const isSmall = window.innerWidth < 720;
  return isSmall ? { width: 360, height: 620 } : { width: 460, height: 780 };
};

export default function App() {
  const flipBookRef = useRef(null);
  const [size, setSize] = useState(getBookSize);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [audioMessage, setAudioMessage] = useState("");
  const shuffleQueueRef = useRef([]);
  const lastErrorTrackRef = useRef(null);
  const [burst, setBurst] = useState({
    key: 0,
    color: heartColors[0],
    origin: "left",
    active: false,
  });
  const burstTimerRef = useRef(null);
  const renderPages = useMemo(() => {
    const output = [];
    pages.forEach((page) => {
      output.push(page);
      if (page.type?.includes("sheet")) {
        output.push({
          id: `${page.id}-back`,
          type: page.backImage ? "image" : "blank",
          image: page.backImage,
          imageAlt: page.backImageAlt,
        });
      }
    });
    return output;
  }, []);
  const pageCount = renderPages.length;

  useEffect(() => {
    const indices = Array.from({ length: songs.length }, (_, idx) => idx);
    shuffleQueueRef.current = indices;
    const handleResize = () => setSize(getBookSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) {
        clearTimeout(burstTimerRef.current);
      }
    };
  }, []);


  const handleFlipNext = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const handleFlipPrev = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const triggerBurst = (color, origin) => {
    setBurst((prev) => ({
      key: prev.key + 1,
      color,
      origin,
      active: true,
    }));
    if (burstTimerRef.current) {
      clearTimeout(burstTimerRef.current);
    }
    burstTimerRef.current = setTimeout(() => {
      setBurst((prev) => ({ ...prev, active: false }));
    }, 2300);
  };

  const refillShuffleQueue = (lastIndex = null) => {
    const indices = Array.from({ length: songs.length }, (_, idx) => idx);
    for (let i = indices.length - 1; i > 0; i -= 1) {
      const swapIndex = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[swapIndex]] = [indices[swapIndex], indices[i]];
    }
    if (indices.length > 1 && lastIndex !== null && indices[0] === lastIndex) {
      [indices[0], indices[1]] = [indices[1], indices[0]];
    }
    shuffleQueueRef.current = indices;
  };

  const getNextTrackIndex = () => {
    if (!shuffleQueueRef.current.length) {
      refillShuffleQueue(currentTrack);
    }
    return shuffleQueueRef.current.shift();
  };

  const playRandomTrack = () => {
    if (!songs.length) {
      return;
    }
    if (songs.length === 1) {
      setCurrentTrack(0);
      return;
    }
    const nextIndex = getNextTrackIndex();
    setCurrentTrack(nextIndex);
  };

  const handleShuffle = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    lastErrorTrackRef.current = null;
    playRandomTrack();
  };

  const handleAudioError = () => {
    if (lastErrorTrackRef.current === currentTrack) {
      return;
    }
    lastErrorTrackRef.current = currentTrack;
    setAudioMessage("Track failed to load. Shuffling...");
    setTimeout(() => playRandomTrack(), 200);
  };

  return (
    <div className="app">
      <div className="book" role="region" aria-label="Diary book">
        <HTMLFlipBook
          ref={flipBookRef}
          width={size.width}
          height={size.height}
          size="stretch"
          minWidth={320}
          maxWidth={600}
          minHeight={520}
          maxHeight={860}
          maxShadowOpacity={0.25}
          flippingTime={2400}
          showCover
          usePortrait={false}
          useMouseEvents={false}
          onFlip={(event) => setCurrentPage(event.data)}
          className="flip-book"
        >
          {renderPages.map((page, index) => {
            const isFirst = currentPage === 0;
            const isLast = currentPage >= pageCount - 1;
            const hasText = Boolean(page.title || page.subtitle || page.body);
            const isSpreadText = page.type?.includes("sheet") && hasText;
            const isLeftPage = index % 2 === 0;
            const showSpreadText = isSpreadText && isLeftPage && !page.backImage;
            const showMusicPlayer = page.id === "6-back";
            const heartClass = `heart-page-${index + 1}`;
            const heartColor = heartColors[index % heartColors.length];

            return (
              <div
                key={page.id}
                className={`page ${page.type || ""} ${
                  showSpreadText ? "spread-left" : ""
                }`.trim()}
              >
                <div className="page-surface">
                  <div className="page-decor" aria-hidden="true">
                    <span className="heart" />
                    <span className="flower" />
                    <span className="heart" />
                    <span className="flower" />
                    <span className="heart" />
                    <span className="flower" />
                  </div>
                  <div className="page-content">
                    {page.image && (
                      <div className="page-image">
                        <img src={page.image} alt={page.imageAlt || "Photo"} />
                      </div>
                    )}
                    {isLeftPage && (
                      <button
                        className={`turn-button edge left heart-button ${heartClass}`}
                        onClick={() => {
                          triggerBurst(heartColor, "right");
                          handleFlipNext();
                        }}
                        disabled={isLast}
                        aria-label="Next page"
                      >
                        ❤
                      </button>
                    )}
                    {!isLeftPage && (
                      <button
                        className={`turn-button edge right heart-button ${heartClass}`}
                        onClick={() => {
                          triggerBurst(heartColor, "left");
                          handleFlipPrev();
                        }}
                        disabled={isFirst}
                        aria-label="Previous page"
                      >
                        ❤
                      </button>
                    )}
                    {showMusicPlayer && (
                      <div className="jukebox" aria-live="polite">
                        <div className="jukebox-card">
                          <div className="jukebox-glow" aria-hidden="true" />
                          <div className="jukebox-top">
                            <div className="jukebox-art" aria-hidden="true">
                              <span className="pulse" />
                              <span className="pulse" />
                            </div>
                            <div className="jukebox-copy">
                              <p className="jukebox-kicker">Surprise playlist</p>
                              <h2>Press the button for a surprise song</h2>
                              <p className="jukebox-track">
                                Now playing: {songs[currentTrack].title}
                              </p>
                              {audioMessage && (
                                <p className="jukebox-status">{audioMessage}</p>
                              )}
                            </div>
                          </div>
                          <div className="jukebox-eq" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                        <AudioPlayer
                          className="jukebox-audio"
                          src={songs[currentTrack].src}
                          autoPlayAfterSrcChange
                          showSkipControls={false}
                          showJumpControls={false}
                          customAdditionalControls={[]}
                          customVolumeControls={[]}
                          onEnded={playRandomTrack}
                          onPlay={() => {
                            setAudioMessage("");
                            lastErrorTrackRef.current = null;
                          }}
                          onError={handleAudioError}
                        />
                        <button
                          className="jukebox-button"
                          onClick={handleShuffle}
                          onPointerDown={(event) => event.stopPropagation()}
                        >
                          Shuffle surprise
                        </button>
                      </div>
                    )}
                    {hasText && (
                      <div
                        className={`page-text ${
                          page.type?.includes("cover") ? "cover-text" : ""
                        } ${page.type === "blank" ? "blank-text" : ""} ${
                          showSpreadText ? "spread-text" : ""
                        }`.trim()}
                      >
                        {page.title && <h1>{page.title}</h1>}
                        {page.subtitle && <p className="subtitle">{page.subtitle}</p>}
                        {page.body && (
                          <p className="body">
                            {page.body.split("\n").map((line, idx) => (
                              <span key={idx}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </HTMLFlipBook>
        <div
          key={burst.key}
          className={`heart-burst ${burst.active ? "active" : ""}`.trim()}
          style={{
            "--burst-color": burst.color,
            "--burst-origin-x": burst.origin === "left" ? "8%" : "92%",
          }}
          aria-hidden="true"
        >
          {Array.from({ length: 24 }).map((_, idx) => (
            <span key={idx} className="burst-heart">
              ❤
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
