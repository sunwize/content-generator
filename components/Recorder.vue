<script lang="ts" setup>
import { isRecording } from "~/stores";
import PhX from "~icons/ph/x";
import SolarRecordBoldDuotone from "~icons/solar/record-bold-duotone";

type Props = {
  targetSelector: string;
};

const props = defineProps<Props>();

const VIDEO_FORMAT = "video/webm";

let mediaRecorder: MediaRecorder | null = null;
const recordedChunks: Blob[] = [];
const video = document.createElement("video");
const canvas = document.createElement("canvas");
const videoId = Math.random().toString(36).substring(7);
const isVideoPreviewVisible = ref(false);

const startRecording = async () => {
    recordedChunks.length = 0; // Clear previous recordings

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

    isRecording.value = true;

    const { left, top, width, height } = element.getBoundingClientRect();
    const croppedStream = cropVideo(left, top, width, height);

    if (!croppedStream) {
        throw new Error("Failed to crop video");
    }

    // Check if audio tracks are available before adding
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
        croppedStream.addTrack(audioTracks[0]);
    }

    mediaRecorder = new MediaRecorder(croppedStream, { mimeType: VIDEO_FORMAT });

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = async () => {
        video.pause();
        const recordedBlob = new Blob(recordedChunks, { type: VIDEO_FORMAT });
        const fileURL = URL.createObjectURL(recordedBlob);

        isVideoPreviewVisible.value = true;
        await nextTick();

        const videoElement = document.getElementById(videoId) as HTMLVideoElement;

        if (videoElement) {
            videoElement.src = fileURL;
        }

        stream.getTracks().forEach((track) => track.stop());
        isRecording.value = false;
    };

    mediaRecorder.start();
};

const stopRecording = () => {
    mediaRecorder?.stop();
};

const cropVideo = (left: number, top: number, width: number, height: number) => {
    // Wait until the video metadata is loaded
    if (video.videoWidth === 0 || video.videoHeight === 0) {
        video.addEventListener("loadedmetadata", () => {
            cropVideo(left, top, width, height);
        }, { once: true });
        return;
    }

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate scaling factors between video and window dimensions
    const widthScale = videoWidth / windowWidth;
    const heightScale = videoHeight / windowHeight;

    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx?.scale(scale, scale);

    function drawFrame() {
        if (!isRecording.value) {
            return;
        }

        if (!canvas || !ctx) {
            requestAnimationFrame(drawFrame);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Adjust source coordinates using calculated scaling factors
        ctx.drawImage(
            video,
            left * widthScale,
            top * heightScale,
            width * widthScale,
            height * heightScale,
            0,
            0,
            width,
            height,
        );
        requestAnimationFrame(drawFrame);
    }
    drawFrame();

    return canvas.captureStream(60);
};

const downloadVideo = () => {
    const videoElement = document.getElementById(videoId) as HTMLVideoElement;

    if (!videoElement) {
        return;
    }

    const a = document.createElement("a");
    const filename = new Date().toISOString().replace(/:/g, "-");
    a.href = videoElement.src;
    a.download = `${filename}.webm`;
    a.click();
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
          class="max-h-[80dvh] aspect-[9/16] object-cover mx-auto"
          controls
        />
        <div class="flex justify-end mt-3">
          <UButton @click="downloadVideo">
            Download
          </UButton>
        </div>
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