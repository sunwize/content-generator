import doneSounds from "~/assets/sounds/done.mp3";
import keyboardSound from "~/assets/sounds/keyboard.mp3";
import popSound from "~/assets/sounds/pop.mp3";
import whooshSound from "~/assets/sounds/whoosh.mp3";

const createSong = (url: string, loop = true) => {
    const audio = document.createElement("audio");
    audio.src = url;
    audio.loop = loop;
    audio.volume = 1;
    audio.preload = "auto";
    audio.autoplay = false;
    audio.load();
    return audio;
};

export const keyboard = createSong(keyboardSound, true);
export const whoosh = createSong(whooshSound, false);
export const pop = createSong(popSound, false);
export const done = createSong(doneSounds, false);

pop.volume = 0.25;
done.volume = 0.25;