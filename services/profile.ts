import {requestGet, requestPost} from "@/utils/http";
import {API_URL} from "@/constant/urls";
import {Profile} from "@/types/types";

export const create_profile = async (payload: any, headers?: Record<string, any>): Promise<Profile> => {
    return await requestPost(API_URL.PROFILE, payload, headers);
};

export const get_profile = async (id?: number, headers?: Record<string, any>): Promise<Profile> => {
    if (id) {
        return await requestGet(`${API_URL.PROFILE}${id}/`, null, headers);
    } else {
        return await requestGet(API_URL.PROFILE, null, headers);
    }
}