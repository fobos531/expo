// Copyright 2023-present 650 Industries. All rights reserved.

import ExpoModulesCore
import AVKit

public final class VideoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoVideo")

    Function("isPictureInPictureSupported") { () -> Bool in
      return AVPictureInPictureController.isPictureInPictureSupported()
    }

    Function("getCurrentVideoCacheSize") {
      VideoCacheManager.shared.getCacheDirectorySize()
    }

    AsyncFunction("setVideoCacheSizeAsync") { size in
      try VideoCacheManager.shared.setMaxCacheSize(newSize: size)
    }

    AsyncFunction("clearVideoCacheAsync") {
      return try await VideoCacheManager.shared.clearAllCache()
    }

    View(VideoView.self) {
      Events(
        "onPictureInPictureStart",
        "onPictureInPictureStop",
        "onFullscreenEnter",
        "onFullscreenExit",
        "onFirstFrameRender"
      )

      Prop("player") { (view, player: VideoPlayer?) in
        view.player = player
      }

      Prop("nativeControls") { (view, nativeControls: Bool?) in
        view.playerViewController.showsPlaybackControls = nativeControls ?? true
        #if os(tvOS)
        view.playerViewController.isSkipForwardEnabled = nativeControls ?? true
        view.playerViewController.isSkipBackwardEnabled = nativeControls ?? true
        #endif
      }

      Prop("contentFit") { (view, contentFit: VideoContentFit?) in
        view.playerViewController.videoGravity = contentFit?.toVideoGravity() ?? .resizeAspect
      }

      Prop("contentPosition") { (view, contentPosition: CGVector?) in
        let layer = view.playerViewController.view.layer

        layer.frame = CGRect(
          x: contentPosition?.dx ?? 0,
          y: contentPosition?.dy ?? 0,
          width: layer.frame.width,
          height: layer.frame.height
        )
      }

      Prop("allowsFullscreen") { (view, allowsFullscreen: Bool?) in
        #if !os(tvOS)
        view.playerViewController.setValue(allowsFullscreen ?? true, forKey: "allowsEnteringFullScreen")
        #endif
      }

      Prop("fullscreenOptions") {(view, options: FullscreenOptions?) in
        view.playerViewController.fullscreenOrientation = options?.orientation.toUIInterfaceOrientationMask() ?? .all
        view.playerViewController.autoExitOnRotate = options?.autoExitOnRotate ?? false
        #if !os(tvOS)
        view.playerViewController.setValue(options?.enable ?? true, forKey: "allowsEnteringFullScreen")
        #endif
      }

      Prop("showsTimecodes") { (view, showsTimecodes: Bool?) in
        #if !os(tvOS)
        view.playerViewController.showsTimecodes = showsTimecodes ?? true
        #endif
      }

      Prop("requiresLinearPlayback") { (view, requiresLinearPlayback: Bool?) in
        view.playerViewController.requiresLinearPlayback = requiresLinearPlayback ?? false
      }

      Prop("allowsPictureInPicture") { (view, allowsPictureInPicture: Bool?) in
        view.allowPictureInPicture = allowsPictureInPicture ?? false
      }

      Prop("startsPictureInPictureAutomatically") { (view, startsPictureInPictureAutomatically: Bool?) in
        #if !os(tvOS)
        view.startPictureInPictureAutomatically = startsPictureInPictureAutomatically ?? false
        #endif
      }

      Prop("allowsVideoFrameAnalysis") { (view, allowsVideoFrameAnalysis: Bool?) in
        #if !os(tvOS)
        if #available(iOS 16.0, macCatalyst 18.0, *) {
          let newValue = allowsVideoFrameAnalysis ?? true

          view.playerViewController.allowsVideoFrameAnalysis = newValue

          // Setting the `allowsVideoFrameAnalysis` to false after the scanning was already perofrmed doesn't update the UI.
          // We can force the desired behaviour by quickly toggling the property. Setting it to true clears existing requests,
          // which updates the UI, hiding the button, then setting it to false before it detects any text keeps it in the desired state.
          // Tested in iOS 17.5
          if !newValue {
            view.playerViewController.allowsVideoFrameAnalysis = true
            view.playerViewController.allowsVideoFrameAnalysis = false
          }
        }
        #endif
      }

      AsyncFunction("enterFullscreen") { view in
        view.enterFullscreen()
      }

      AsyncFunction("exitFullscreen") { view in
        view.exitFullscreen()
      }

      AsyncFunction("startPictureInPicture") { view in
        try view.startPictureInPicture()
      }

      AsyncFunction("stopPictureInPicture") { view in
        view.stopPictureInPicture()
      }
    }

    View(VideoAirPlayButtonView.self) {
      Events(
        "onBeginPresentingRoutes",
        "onEndPresentingRoutes"
      )

      Prop("tint") { (view, tint: UIColor?) in
        view.tint = tint
      }

      Prop("activeTint") { (view, activeTint: UIColor?) in
        view.activeTintColor = activeTint
      }

      Prop("prioritizeVideoDevices") { (view, prioritizeVideoDevices: Bool?) in
        view.prioritizeVideoDevices = prioritizeVideoDevices ?? true
      }
    }

    Class(VideoPlayer.self) {
      Constructor { (source: VideoSource?, useSynchronousReplace: Bool?) -> VideoPlayer in
        let useSynchronousReplace = useSynchronousReplace ?? false
        let player = AVPlayer()
        let videoPlayer = try VideoPlayer(player, initialSource: source, useSynchronousReplace: useSynchronousReplace)
        player.pause()
        return videoPlayer
      }

      Property("playing") { player -> Bool in
        return player.isPlaying
      }

      Property("muted") { player -> Bool in
        return player.isMuted
      }
      .set { (player, muted: Bool) in
        player.isMuted = muted
      }

      Property("allowsExternalPlayback") { player -> Bool in
        return player.ref.allowsExternalPlayback
      }
      .set { (player, allowsExternalPlayback: Bool) in
        player.ref.allowsExternalPlayback = allowsExternalPlayback
      }

      Property("staysActiveInBackground") { player -> Bool in
        return player.staysActiveInBackground
      }
      .set { (player, staysActive: Bool) in
        player.staysActiveInBackground = staysActive
      }

      Property("loop") { player -> Bool in
        return player.loop
      }
      .set { (player, loop: Bool) in
        player.loop = loop
      }

      Property("currentTime") { player -> Double in
        return player.currentTime
      }
      .set { (player, time: Double) in
        // Only clamp the lower limit, AVPlayer automatically clamps the upper limit.
        player.currentTime = time
      }

      Property("currentLiveTimestamp") { player -> Double? in
        return player.currentLiveTimestamp
      }

      Property("currentOffsetFromLive") { player -> Double? in
        return player.currentOffsetFromLive
      }

      Property("targetOffsetFromLive") { player -> Double in
        return player.ref.currentItem?.configuredTimeOffsetFromLive.seconds ?? 0
      }
      .set { (player, timeOffset: Double) in
        let timeOffset = CMTime(seconds: timeOffset, preferredTimescale: .max)
        player.ref.currentItem?.configuredTimeOffsetFromLive = timeOffset
      }

      Property("duration") { player -> Double in
        let duration = player.ref.currentItem?.duration.seconds ?? 0
        return duration.isNaN ? 0 : duration
      }

      Property("playbackRate") { player -> Float in
        return player.playbackRate
      }
      .set { (player, playbackRate: Float) in
        player.playbackRate = playbackRate
      }

      Property("isLive") { player -> Bool in
        return player.ref.currentItem?.duration.isIndefinite ?? false
      }

      Property("preservesPitch") { player -> Bool in
        return player.preservesPitch
      }
      .set { (player, preservesPitch: Bool) in
        player.preservesPitch = preservesPitch
      }

      Property("timeUpdateEventInterval") { player -> Double in
        return player.timeUpdateEventInterval
      }
      .set { (player, timeUpdateEventInterval: Double) in
        player.timeUpdateEventInterval = timeUpdateEventInterval
      }

      Property("showNowPlayingNotification") { player -> Bool in
        return player.showNowPlayingNotification
      }
      .set { (player, showNowPlayingNotification: Bool) in
        player.showNowPlayingNotification = showNowPlayingNotification
      }

      Property("status") { player in
        return player.status.rawValue
      }

      Property("volume") { player -> Float in
        return player.volume
      }
      .set { (player, volume: Float) in
        player.volume = volume
      }

      Property("bufferedPosition") { player -> Double in
        return player.bufferedPosition
      }

      Property("bufferOptions") { player -> [String: Any] in
        return player.bufferOptions.toDictionary()
      }
      .set { (player, bufferOptions: BufferOptions) in
        player.bufferOptions = bufferOptions
      }

      Property("audioMixingMode") { player -> AudioMixingMode in
        return player.audioMixingMode
      }
      .set { player, audioMixingMode in
        player.audioMixingMode = audioMixingMode
      }

      Property("availableVideoTracks") { player -> [VideoTrack] in
        return player.availableVideoTracks
      }

      Property("videoTrack") { player -> VideoTrack? in
        return player.currentVideoTrack
      }

      Property("availableSubtitleTracks") { player -> [SubtitleTrack] in
        return player.subtitles.availableSubtitleTracks
      }

      Property("subtitleTrack") { player -> SubtitleTrack? in
        return player.subtitles.currentSubtitleTrack
      }
      .set { player, subtitleTrack in
        player.subtitles.selectSubtitleTrack(subtitleTrack: subtitleTrack)
      }

      Property("availableAudioTracks") { player -> [AudioTrack] in
        return player.audioTracks.availableAudioTracks
      }

      Property("audioTrack") { player -> AudioTrack? in
        return player.audioTracks.currentAudioTrack
      }
      .set { player, audioTrack in
        player.audioTracks.selectAudioTrack(audioTrack: audioTrack)
      }

      Property("isExternalPlaybackActive") { player -> Bool in
        return player.ref.isExternalPlaybackActive
      }

      Function("play") { player in
        player.ref.play()
      }

      Function("pause") { player in
        player.ref.pause()
      }

      Function("replace") { (player, source: Either<String, VideoSource>?) in
        let videoSource = parseSource(source: source)
        try player.replaceCurrentItem(with: videoSource)
      }

      AsyncFunction("replaceAsync") { (player, source: Either<String, VideoSource>?) in
        let videoSource = parseSource(source: source)
        try await player.replaceCurrentItem(with: videoSource)
      }

      Function("seekBy") { (player, seconds: Double) in
        let newTime = player.ref.currentTime() + CMTime(seconds: seconds, preferredTimescale: .max)

        player.ref.seek(to: newTime)
      }

      Function("replay") { player in
        player.ref.seek(to: CMTime.zero)
      }

      AsyncFunction("generateThumbnailsAsync") { (player: VideoPlayer, times: [CMTime]?, options: VideoThumbnailOptions?) -> [VideoThumbnail] in
        guard let times, !times.isEmpty else {
          return []
        }
        guard let asset = player.ref.currentItem?.asset else {
          // TODO: We should throw here as nothing is playing
          return []
        }
        return try await generateThumbnails(
          asset: asset,
          times: times,
          options: options ?? .default
        )
      }
    }

    Class(VideoThumbnail.self) {
      Property("width", \.ref.size.width)
      Property("height", \.ref.size.height)
      Property("requestedTime", \.requestedTime.seconds)
      Property("actualTime", \.actualTime.seconds)
    }

    OnAppEntersBackground {
      VideoManager.shared.onAppBackgrounded()
    }

    OnAppEntersForeground {
      VideoManager.shared.onAppForegrounded()
    }
  }

  private func parseSource(source: Either<String, VideoSource>?) -> VideoSource? {
    guard let source else {
      return nil
    }
    if source.is(String.self), let url: String = source.get() {
      return VideoSource(uri: URL(string: url))
    }
    if source.is(VideoSource.self) {
      return source.get()
    }
    return nil
  }
}
