const createSong = (name: string, loop = true) => {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.loop = loop;
    audio.preload = "auto";
    audio.autoplay = false;
    audio.load();
    return audio;
};

export const keyboard = createSong("keyboard", true);
export const whoosh = createSong("whoosh", false);