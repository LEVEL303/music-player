export interface Track {
    src: string;
    title: string;
    artist: string;
    cover: string;
}

export const musicList: Track[] = [
    {
        src: "/music/chega-de-saudade.mp3",
        title: "Chega de Saudade",
        artist: "Tom Jobim",
        cover: "/img/chega-de-saudade-capa.jpg"
    },
    {
        src: "/music/please-please-me.mp3",
        title: "Please Please Me",
        artist: "The Beatles",
        cover: "/img/please-please-me-capa.jpg"
    },
    {
        src: "/music/rewrite.mp3",
        title: "Rewrite",
        artist: "Asian Kung-Fu Generation",
        cover: "/img/rewrite-capa.jpeg"
    }
];