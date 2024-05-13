<script setup>
const props = defineProps({
  data: { type: Array, default: () => [] },
  volume: { type: Number, default: 1 },
  muted: { type: Boolean, default: false },
});

const emitEvents = Object.freeze({
  play: "play",
  pause: "pause",
  ended: "ended",
  prev: "prev",
  next: "next",
  currentPlay: "currentPlay",
});
const emits = defineEmits(Object.values(emitEvents).map((i) => i));

const audio = ref(null);
const playerBox = ref(null);
const playerProgress = ref(null);

const audioSrc = ref("");

const useMouseEvent = (eventName, fn) => {
  playerBox.value.addEventListener(eventName, fn);

  return () => {
    playerBox.value.removeEventListener(eventName, fn);
  };
};

onMounted(() => {
  if (!audio.value) return;

  audio.value.volume = props.volume;
  audio.value.muted = props.muted;

  // 可播放触发 - src 加载完成触发
  audio.value.oncanplay = () => {
    // 保持倍速播放记录
    handleChangePlaybackRate(false);

    if (isSwitchAudioSrc.value) {
      isSwitchAudioSrc.value = false;

      setAudioProgressBarState(0, backRate.value);

      // 只有已播放情况下切换才要重新调用播放
      if (isPlay.value) setPlay();
    }
  };

  // 倍速变更触发
  audio.value.onratechange = (e) => {
    setAudioProgressBarState(null, audio.value.playbackRate);
  };

  audio.value.onended = () => {
    setAudioProgressBarState(0, audio.value.playbackRate);
    emits(emitEvents.ended, { id: "" });
  };
});

/** 获取播放器进度条宽度 */
const getPlayerProgressWidth = () => {
  return playerProgress.value.offsetWidth;
};
/** 获取进度条当前宽度 */
const getProgressBarWidth = () => {
  return playerProgress.value.querySelector(".progress-bar").offsetWidth;
};

const setPlay = () => {
  audio.value.play();
  emits(emitEvents.currentPlay, { id: "" });
};
const setPause = () => {
  audio.value.pause();
  emits(emitEvents.pause, { id: "" });
};

/** 播放器播放状态记录 */
const isPlay = ref(false);
/** 是否加载完成 */
const isLoadEnd = () => audio.value && Number.isFinite(audio.value.duration);
/** 当前音频未播放 */
const unplayed = () => audio.value.paused || audio.value.ended;
// 点击改变播放状态
const handleChangePlayState = () => {
  if (!audio.value) return;
  else {
    if (!isLoadEnd()) return;
  }

  if (unplayed()) {
    setPlay();
    isPlay.value = true;
    emits(emitEvents.play, { id: "" });
  } else {
    setPause();
    isPlay.value = false;
  }
  setAudioProgressBarState();
};

let currentWidth = 0; // 当前进度条宽度
let isDnD = false;
/** 拖动进度条 */
const handleProgressDnD = (event) => {
  isDnD = true;
  event.stopPropagation();
  if (!isLoadEnd()) return;

  // 记录点击 x 坐标
  const prevX = event.clientX;

  currentWidth = getProgressBarWidth();

  // 拖动计算距离
  const moveDistance = (event) => {
    // 点击坐标 - 当前坐标 + 进度宽度
    const nextX = currentWidth + (event.clientX - prevX);

    // 边界处理
    if (nextX > getPlayerProgressWidth()) return;
    if (nextX < 1) return;

    return nextX;
  };

  // 阻止选中
  document.onselectstart = () => false;

  // 拖动只改变进度条宽度
  const mouseMove = useMouseEvent("mousemove", (event) => {
    event.preventDefault();
    setAudioProgressBarState(moveDistance(event));
  });

  // 拖动结束，设置新宽度和新的播放时间
  const mouseUp = useMouseEvent("mouseup", (event) => {
    event.stopPropagation();
    mouseMove();
    mouseUp();

    isDnD = false;

    // 恢复选中
    document.onselectstart = null;

    const width = moveDistance(event);
    const { duration } = calcPlayState(width);
    setAudioProgressBarState(width);
  });
};

/** 处理点击跳转进度 */
const handleJumpProgress = (event) => {
  if (isDnD) return;
  event.stopPropagation();
  setAudioProgressBarState(event.offsetX);
};

// 倍速记录
const backRate = ref(props.ratechange);
// 倍速变更
const handleChangePlaybackRate = (isChange = true) => {
  isChange && (backRate.value = backRate.value === 1 ? 2 : 1);
  audio.value.playbackRate = backRate.value;
};

// 设置上下一条播放音频
const isSwitchAudioSrc = ref(false);
const handleChangeAudioSrc = (step = 1) => {
  if (![-1, 1].includes(step)) return;
  audioSrc.value =
    step === 1
      ? "https://media.xyzcdn.net/ljAZ7xwe1MgWV4nmOu1gUxvx_dTn.m4a"
      : "https://media.xyzcdn.net/lqtzXLz-4lYz_JFReohDlwkUxr38.m4a";

  step === -1 && emits(emitEvents.prev, { id: "" });
  step === 1 && emits(emitEvents.next, { id: "" });

  isSwitchAudioSrc.value = true;
};

/**
 * 计算播放时长状态
 * @param width 进度条当前宽度 - 获取传入
 * @returns currentTime: 当前播放时间， duration 剩余播放时间
 */
const calcPlayState = (width = 0) => {
  const percent = parseInt(`${(width / getPlayerProgressWidth()) * 100}`) / 100;

  const currentTime = parseInt(`${audio.value.duration * percent}`);

  const duration = audio.value.duration - currentTime;

  return { currentTime, duration };
};

/** 过度样式记录 */
const progressBarTransition = ref("");
/** 设置播放状态 - 进度条与时间 */
const setAudioProgressBarState = (offsetWidth, backRate = 1) => {
  if (!isLoadEnd()) return;

  const width = Number.isFinite(offsetWidth)
    ? offsetWidth
    : getProgressBarWidth();

  progressBarTransition.value = `width:${width}px`;

  const { currentTime, duration } = calcPlayState(width);

  if (isPlay.value) {
    if (currentTime > 0 && currentTime < audio.value.duration) {
      if (!isDnD) audio.value.currentTime = currentTime;
    }
  } else {
    if (isDnD) return;
    nextTick(() => {
      // 解决渲染过快写入未能生效的问题
      const style = [`width:${getPlayerProgressWidth()}px`];

      style.push(`transition: width ${duration / backRate}s linear`);

      progressBarTransition.value = style.join(";");
      currentTime && (audio.value.currentTime = currentTime);
    });
  }
};

const setAudioVolume = (val) => {
  if (val < 1) return 0; // 直接设置为 0
  if (val > 99) return 1; // 直接设置为 1

  const sVal = `${val / 100}`.split(".");
  const nVal = sVal[1].substring(0, 2);
  return `0.${nVal}` * 1;
};
</script>

<template>
  <section ref="playerBox" class="player-box">
    <div class="player-play-bar">
      <div @click="handleChangeAudioSrc(-1)">---</div>
      <div @click="handleChangePlayState">播放</div>
      <div @click="handleChangeAudioSrc(1)">+++</div>
    </div>
    <div class="player-status-bar">
      <div class="palyer-info-bar" @click="handleChangePlaybackRate">
        666 {{ backRate }} {{ backRate === 1 ? "1.x" : "2.x" }}
      </div>
      <div
        ref="playerProgress"
        class="player-progress"
        @click.self="handleJumpProgress"
      >
        <div class="progress-bar" :style="progressBarTransition">
          <div class="progress-slider" @mousedown="handleProgressDnD"></div>
        </div>
      </div>
    </div>
    <div class="player-"></div>
    <audio ref="audio" preload="auto" :src="audioSrc"></audio>
  </section>
</template>

<style lang="scss" scoped>
.player-box {
  display: flex;
  gap: 8px;

  .player-play-bar {
    display: flex;
    flex: none;
  }

  .player-status-bar {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;

    .player-progress {
      position: relative;
      height: 8px;
      background-color: rgba(216, 216, 216, 0.7);
      border-radius: 999px;
      will-change: auto;

      .progress-bar {
        width: 0px;
        height: inherit;
        background-color: rgba(0, 145, 255, 0.6);
        border-radius: inherit;
        transform: translateZ(0);
        pointer-events: none;
      }

      .progress-slider {
        position: absolute;
        top: -4px;
        right: -8px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 16px;
        background-color: #fff; // var()
        border-radius: inherit;
        box-shadow: 0 0 3px 0 rgb(0, 0, 0, 0.35);
        pointer-events: auto;

        &:after {
          content: "";
          flex: none;
          width: 8px;
          height: 8px;
          background-color: rgba(0, 145, 255, 0.6); // var()
          border-radius: inherit;
          box-shadow: 0 1px 1px 0 rgb(0, 0, 0, 0.35);
        }
      }
    }
  }
}
</style>
