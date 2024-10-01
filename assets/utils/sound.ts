const createSong = (name: string, loop = true) => {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.loop = loop;
    audio.volume = 1;
    audio.preload = "auto";
    audio.autoplay = false;
    audio.load();
    return audio;
};

export const keyboard = createSong("keyboard", true);
export const whoosh = createSong("whoosh", false);
export const pop = createSong("pop", false);

pop.volume = 0.25;