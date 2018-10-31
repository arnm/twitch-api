import axios, { AxiosInstance } from 'axios';

export namespace NewAPI {
    export interface TwitchResponse<T> {
        data: T[]
        pagination: {
            cursor: string
        }
    }

    export interface Oauth2TokenResponse {
        access_token: string
        refresh_token: string
        token_type: string
        expires_in: number
    }

    export interface Clip {
        id: string
        url: string
        embed_url: string
        broadcaster_id: string
        creator_id: string
        video_id: string
        game_id: string
        language: string
        title: string
        view_count: number
        created_at: string
        thumbnail_url: string

        vod_offset: number
        vod_id: string
    }

    export interface GetClipsQueryParamsWithOptionals {
        before?: string
        after?: string
        first?: number
        started_at?: string
        ended_at?: string
    }

    export interface GetClipsQueryParamsWithBrodcasterId extends GetClipsQueryParamsWithOptionals {
        broadcaster_id: string
    }

    export interface GetClipsQueryParamsWithGameId extends GetClipsQueryParamsWithOptionals {
        game_id: string
    }

    export interface GetClipsQueryParamsWithId extends GetClipsQueryParamsWithOptionals {
        id: string
    }

    export type GetClipsQueryParams = GetClipsQueryParamsWithBrodcasterId | GetClipsQueryParamsWithGameId | GetClipsQueryParamsWithId;

    export interface Game {
        id: string
        name: string
        box_art_url: string
    }

    export interface GetGameQueryParamsWithId {
        id: string
    }

    export interface GetGameQueryParamsWithName {
        name: string
    }

    export type GetGameQueryParams = GetGameQueryParamsWithId | GetGameQueryParamsWithName;

    export interface User {
        id: string
        login: string
        display_name: string
        type: string
        broadcaster_type: string
        description: string
        profile_image_url: string
        offline_image_url: string
        view_count: number
    }

    export interface GetUsersQueryParamsWithId {
        id: string
    }

    export interface GetUsersQueryParamsWithLogin {
        login: string
    }

    export type GetUsersQueryParams = GetUsersQueryParamsWithId | GetUsersQueryParamsWithLogin | {};

    // function isGetUserQueryParamsWithId(x: any): x is GetUsersQueryParamsWithId {
    //     return x.id !== undefined;
    // }

    // function isGetUserQueryParamsWithLogin(x: any): x is GetUsersQueryParamsWithLogin {
    //     return x.login !== undefined;
    // }


    export interface TokenResponse {
        access_token: string
        refresh_token: string
        expires_in: number
        scope: string
        token_type: string
    }

    export async function getAccessToken(client_id: string, client_secret: string, scopes: string[] = []): Promise<TokenResponse> {
        const res: TokenResponse = (await axios.request({
            url: 'https://id.twitch.tv/oauth2/token',
            method: 'POST',
            params: {
                client_id,
                client_secret,
                grant_type: 'client_credentials',
                scopes: scopes.join(',')
            }
        })).data;

        return res;
    }

    export class Client {

        private client: AxiosInstance;

        constructor(access_token: string) {
            this.client = axios.create({
                baseURL: 'https://api.twitch.tv/helix',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
        }

        async getTopGames(): Promise<TwitchResponse<Game>> {
            const res: TwitchResponse<Game> = (await this.client.get('/games/top')).data;
            return res;
        }

        async getGame(params: GetGameQueryParams): Promise<TwitchResponse<Game>> {
            const res: TwitchResponse<Game> = (await this.client.get('/games', { params })).data;
            return res;
        }

        async getClips(params: GetClipsQueryParams): Promise<TwitchResponse<Clip>> {
            const res: TwitchResponse<Clip> = (await this.client.get('/clips', { params })).data;

            // additional clip information
            const data = await Promise.all(res.data.map(async (clip) => {
                const cdata = (await axios.get(`https://clips.twitch.tv/api/v2/clips/${clip.id}`)).data;
                clip.vod_offset = cdata.vod_offset;
                clip.vod_id = cdata.vod_id;
                return clip;
            }));

            return { data, pagination: res.pagination };
        }

        async getUsers(params: GetUsersQueryParams = {}): Promise<TwitchResponse<User>> {
            const res: TwitchResponse<User> = (await this.client.get('/users', { params })).data;
            return res;
        }

    }
}
