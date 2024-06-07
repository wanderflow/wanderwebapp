import request from "@/utils/request";

export const getInviteAnswers = param =>
  request.post(import.meta.env.VITE_EXPRESS_BACKEND + "/get_invite_answers_list", param);