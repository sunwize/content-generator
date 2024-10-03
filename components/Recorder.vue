<script lang="ts" setup>
type Props = {
  targetSelector: string;
};

const props = defineProps<Props>();

let mediaRecorder: MediaRecorder | null = null;
const recordedChunks: Blob[] = [];
const video = document.createElement("video");
const canvas = document.createElement("canvas");

const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
        // @ts-expect-error This is not yet in the TypeScript lib
        preferCurrentTab: true,
        systemAudio: "include",
        frameRate: 120,
    });

    video.srcObject = stream;
    video.play();

    const element = document.querySelector(props.targetSelector);

    if (!element) {
        throw new Error("Target element not found");
    }

    const { left, top, width, height } = element.getBoundingClientRect();
    const croppedStream = cropVideo(left, top, width, height);

    mediaRecorder = new MediaRecorder(stream, { mimeType: "video/mp4" });

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        video.pause();
        const recordedBlob = new Blob(recordedChunks, { type: "video/mp4" });

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(recordedBlob);
        downloadLink.download = "recorded-area.mp4";
        downloadLink.textContent = "Download video";
        downloadLink.click();
    };

    mediaRecorder.start();
};

const stopRecording = () => {
    mediaRecorder?.stop();
};

const cropVideo = (left: number, top: number, width: number, height: number) => {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    function drawFrame() {
        if (!canvas || !ctx || video.paused || video.ended) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, left, top, width, height, 0, 0, width, height);
        requestAnimationFrame(drawFrame); // Continuously capture frames
    }
    drawFrame();

    return canvas.captureStream(60);
};
</script>

<template>
  <div>
    <UButton @click="startRecording">
      Start recording
    </UButton>
    <UButton @click="stopRecording">
      Stop recording
    </UButton>
  </div>
</template>