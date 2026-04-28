import {requestPost} from "@/utils/http";
import {API_URL} from "@/constant/urls";

export const create_profile = async (payload: any, headers?: Record<string, any>): Promise<any> => {
    return await requestPost(API_URL.PROFILE, payload, headers);
};