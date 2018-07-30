import * as types from '../constants/WidgetActionTypes';
export const uploadWidget = (access_time, data) => (
  {
    types: [types.UPLOAD_WIDGET, types.UPLOAD_WIDGET_SUCCESS, types.UPLOAD_WIDGET_FAIL],
    promise: (client) => client.post(`/api/widget/upload?access_time=${access_time}`, data)
  }
)

export const checkEmail = (email) => (
  {
    types: [types.CHECK_EMAIL, types.CHECK_EMAIL_SUCCESS, types.CHECK_EMAIL_FAIL],
    promise: (client) => client.put(`/api/widget/account?email=${email}`)
  }
)

export const changeLink = (link) => (
  {
    types: [types.CHANGE_LINK, types.CHANGE_LINK_SUCCESS, types.CHANGE_LINK_FAIL],
    promise: (client) => client.put(`/api/widget/change-link?link=${link}`)
  }
)
export const Register = (data, access_time, code, url) => (
  {
    types: [types.REGISTER_WIDGET, types.REGISTER_WIDGET_SUCCESS, types.REGISTER_WIDGET_FAIL],
    promise: (client) => client.post(`/api/widget/register?access_time=${access_time}&code=${code}&url=${url}`, data)
  }
)

