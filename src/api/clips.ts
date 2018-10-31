import axios, { AxiosInstance } from 'axios';

export namespace ClipsAPI {
    export interface Clip {
        broadcaster_channel_url: string
        broadcaster_display_name: string
        broadcaster_id: string
        broadcaster_login: string
        broadcaster_logo: string
        broadcast_id: string
        curator_channel_url: string
        curator_display_name: string
        curator_id: string
        curator_login: string,
        curator_logo: string
        preview_image: string
        thumbnails: {
            medium: string
            small: string
            tiny: string
        },
        game: string,
        communities: string[],
        created_at: string,
        title: string,
        language: string,
        url: string
        info_url: string,
        status_url: string
        edit_url: string
        vod_id: string,
        vod_url: string,
        vod_offset: number,
        vod_preview_image_url: string,
        embed_url: string
        embed_html: string
        view_url: string
        id: string,
        slug: string,
        duration: number,
        views: number
    }

    export class Client {

        private client: AxiosInstance;

        constructor() {
            this.client = axios.create({
                baseURL: 'https://clips.twitch.tv/api/v2/clips'
            });
        }

        async getClip(id: string): Promise<Clip> {
            const res: Clip = (await this.client.get(id)).data;
            return res;
        }
    }
}
