// Service chạy nền cho react-native-track-player.
// Đây là phần thay thế setupMediaSession() + Service Worker notification
// trong app.js gốc — nhưng ở native, track-player tự vẽ thông báo/điều khiển
// trên màn hình khóa, thanh kéo xuống, tai nghe Bluetooth,... không cần code thêm.
import TrackPlayer, { Event } from 'react-native-track-player';

export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => TrackPlayer.seekTo(event.position));

  // next/previous thật sự được điều phối bởi usePlaybackStore (moveQueue),
  // service chỉ chuyển tiếp sự kiện ra ngoài qua chính TrackPlayer queue
  // mà store đã đồng bộ, nên ở đây gọi thẳng skipToNext/skipToPrevious là đủ.
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext().catch(() => {}));
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious().catch(() => {}));

  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    if (event.paused) await TrackPlayer.pause();
    else if (event.permanent) await TrackPlayer.pause();
    else await TrackPlayer.play();
  });
}
