<script lang="ts" setup>
import PhX from "~icons/ph/x";
import SolarRecordBoldDuotone from "~icons/solar/record-bold-duotone";

type Props = {
  targetSelector: string;
};

const props = defineProps<Props>();

let mediaRecorder: MediaRecorder | null = null;
const recordedChunks: Blob[] = [];
const video = document.createElement("video");
const canvas = document.createElement("canvas");
const isRecording = ref(false);
const videoId = crypto.randomUUID();
const isVideoPreviewVisible = ref(false);

const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
            frameRate: 60,
        },
        audio: true,
        // @ts-expect-error This is not yet in the TypeScript lib
        preferCurrentTab: true,
        systemAudio: "include",
    });

    video.srcObject = stream;
    video.muted = true;
    await video.play();

    const element = document.querySelector(props.targetSelector);

    if (!element) {
        throw new Error("Target element not found");
    }

    const { left, top, width, height } = element.getBoundingClientRect();
    const croppedStream = cropVideo(left, top, width, height);
    croppedStream.addTrack(stream.getAudioTracks()[0]);

    mediaRecorder = new MediaRecorder(croppedStream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = async () => {
        video.pause();
        const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        const fileURL = URL.createObjectURL(recordedBlob);

        isVideoPreviewVisible.value = true;
        await nextTick();

        const videoElement = document.getElementById(videoId) as HTMLVideoElement;

        if (!videoElement) {
            return;
        }

        videoElement.src = fileURL;

        stream.getTracks().forEach((track) => track.stop());
        isRecording.value = false;
    };

    mediaRecorder.start();
    isRecording.value = true;
};

const stopRecording = () => {
    mediaRecorder?.stop();
};

const cropVideo = (left: number, top: number, width: number, height: number) => {
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    const x = left * window.devicePixelRatio;
    const y = top * window.devicePixelRatio;
    const ctx = canvas.getContext("2d");

    function drawFrame() {
        if (!canvas || !ctx || video.paused || video.ended) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, x, y, width, height, 0, 0, width, height);
        requestAnimationFrame(drawFrame); // Continuously capture frames
    }
    drawFrame();

    return canvas.captureStream(60);
};
</script>

<template>
  <div class="flex items-center gap-2">
    <UTooltip
      v-if="!isRecording"
      text="Start recording"
    >
      <UButton
        variant="ghost"
        color="gray"
        @click="startRecording"
      >
        <SolarRecordBoldDuotone class="size-6" />
      </UButton>
    </UTooltip>
    <UTooltip
      v-else
      text="Stop recording"
    >
      <UButton
        variant="ghost"
        color="red"
        @click="stopRecording"
      >
        <SolarRecordBoldDuotone class="size-6" />
      </UButton>
    </UTooltip>

    <UModal
      v-model="isVideoPreviewVisible"
      fullscreen
    >
      <UCard class="h-full flex justify-center items-center">
        <video
          :id="videoId"
          class="w-full max-w-[1000px] object-contain mx-auto"
          controls
        />
      </UCard>
      <UButton
        variant="ghost"
        color="gray"
        class="absolute top-3 right-2"
        @click="isVideoPreviewVisible = false"
      >
        <PhX class="size-6" />
      </UButton>
    </UModal>
  </div>
</template>