import request from "@/utils/request";

export const getInviteAnswers = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/get_invite_answers_list",
    param
  );

export const createInviteUserRelation = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/create_invite_user_relation",
    param
  );

export const expressionsExpress = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/get_all_expressions",
    param
  );
export const expressList = (param) =>
  request.get(import.meta.env.VITE_EXPRESS_BACKEND + "/get_all_express", param);
export const dailyExpressList = (param) =>
  request.get(
    import.meta.env.VITE_EXPRESS_BACKEND + "/get_today_question_list",
    param
  );
export const updateDailyList = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/update_today_question_list",
    param
  );
export const updateCollegeDailyList = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/update_college_question_list",
    param
  );

export const deleteExpression = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/delete_expressions",
    param
  );

export const deleteExpress = (param) =>
  request.post(import.meta.env.VITE_EXPRESS_BACKEND + "/delete_express", param);

export const editExpress = (param) =>
  request.post(import.meta.env.VITE_EXPRESS_BACKEND + "/update_express", param);

export const searchExpress = (param) =>
  request.post(import.meta.env.VITE_EXPRESS_BACKEND + "/search_express", param);

export const createExpress = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/create_express_question",
    param
  );

export const getCollegeList = (param) =>
  request.get(
    import.meta.env.VITE_EXPRESS_BACKEND + "/get_today_college_list",
    param
  );
export const getUserExpress = (param) =>
  request.get(
    import.meta.env.VITE_EXPRESS_BACKEND + "/get_user_create_question_list",
    param
  );

export const approveUserQuestion = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/update_user_create_question",
    param
  );

export const getCollegeDisplayList = () =>
  request.post(import.meta.env.VITE_EXPRESS_BACKEND + "/get_college", {});

export const updateCollege = (data) =>
  request.post(import.meta.env.VITE_EXPRESS_BACKEND + "/update_college", data);
