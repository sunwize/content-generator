<script lang="ts" setup>
type Props = {
  targetSelector: string;
};

const props = defineProps<Props>();

let mediaRecorder: MediaRecorder | null = null;
const recordedChunks: Blob[] = [];
const videoElement = ref<HTMLVideoElement>();
const canvas = document.createElement("canvas");

const startRecording = async () => {
    const video = document.createElement("video");

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
    video.play();

    mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        video.pause();
        const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        const fileURL = URL.createObjectURL(recordedBlob);

        if (!videoElement.value) {
            return;
        }

        videoElement.value.src = fileURL;
        videoElement.value.classList.remove("hidden");

        stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
};

const stopRecording = () => {
    mediaRecorder?.stop();
};

// const cropVideo = (left: number, top: number, width: number, height: number) => {
//     canvas.width = width;
//     canvas.height = height;
//     const ctx = canvas.getContext("2d");

//     function drawFrame() {
//         if (!canvas || !ctx || video.paused || video.ended) {
//             return;
//         }

//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(video, left, top, width, height, 0, 0, width, height);
//         requestAnimationFrame(drawFrame); // Continuously capture frames
//     }
//     drawFrame();

//     return canvas.captureStream(60);
// };
</script>

<template>
  <div>
    <video
      ref="videoElement"
      class="hidden w-80"
      controls
    />
    <UButton @click="startRecording">
      Start recording
    </UButton>
    <UButton @click="stopRecording">
      Stop recording
    </UButton>
  </div>
</template>