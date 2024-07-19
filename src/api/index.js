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

  export const deleteExpression = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/delete_expressions",
    param
  );

  export const deleteExpress = (param) =>
  request.post(
    import.meta.env.VITE_EXPRESS_BACKEND + "/delete_express",
    param
  );
