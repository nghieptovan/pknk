import * as types from '../constants/ClientActionTypes';

export const getList = (token) => (
  {
    types: [types.GET_LIST, types.GET_LIST_SUCESS, types.CREATE_CLIENT_FAIL],
    promise: (client) => client.get(`/api/client/get?access_token=${token}`)
  }
)
export const getListLiveChallenge = (token, page, maxRecords) => (
  {
    types: [types.GET_LIST, types.GET_LIST_SUCESS, types.CREATE_CLIENT_FAIL],
    promise: (client) => client.get(token ?`/api/client/get/haslivechallenge?access_token=${token}&page=${page}&maxRecords=${maxRecords}`: `/api/client/get/haslivechallenge?page=${page}&maxRecords=${maxRecords}`)
  }
)
export const getListNewDashboard = (token, page, maxRecords) => (
  {
    types: [types.GET_LIST, types.GET_LIST_SUCESS, types.CREATE_CLIENT_FAIL],
    promise: (client) => client.get(token ?`/api/client/get/new-dashboard?access_token=${token}&page=${page}&maxRecords=${maxRecords}`: `/api/client/get/new-dashboard?page=${page}&maxRecords=${maxRecords}`)
  }
)

export const createClient  = (data, token) => (
  {
      types: [types.CREATE_CLIENT, types.CREATE_CLIENT_SUCESS, types.CREATE_CLIENT_FAIL],
      promise: (client) => client.post(`/api/client/create?access_token=${token}`,{
        brand_name: data.brand_name,
        firstName: data.firstName,
        lastName: data.lastName,
        start_date: data.start_date,
        end_date: data.end_date,
        email: data.email,
        mobile_number: data.mobile_number,
        entribe_rep: data.entribe_rep,
        password: data.password,
        username: data.username,
        logo: data.imageContent,
        logoName: data.imageFileName
      })
  }
)

export const editClient  = (data, token) => ( 
  {
      types: [types.EDIT_CLIENT, types.EDIT_CLIENT_SUCESS, types.EDIT_CLIENT_FAIL],
      promise: (client) => client.put(`/api/client/edit?access_token=${token}`,data)
  }
)

export const searchClient  = (data, token) => (
  {
      types: [types.SEARCH_CLIENT, types.SEARCH_CLIENT_SUCESS, types.SEARCH_CLIENT_FAIL],
      promise: (client) => client.get(`/api/client/search?access_token=${token}&name=${data}`)
  }
)

export const exportClient  = (token) => (
  {
      types: [types.EXPORT_CLIENT, types.EXPORT_CLIENT_SUCESS, types.EXPORT_CLIENT_FAIL],
      promise: (client) => client.get(`/api/export/client/pdf?access_token=${token}`)
  }
)

export const exportExcelClient  = (token) => (
  {
      types: [types.EXPORT_EXCEL_CLIENT, types.EXPORT_EXCEL_CLIENT_SUCESS, types.EXPORT_EXCEL_CLIENT_FAIL],
      promise: (client) => client.get(`/api/export/client/excel?access_token=${token}`)
  }
)

export const exportCSVClient  = (token) => (
  {
      types: [types.EXPORT_CSV_CLIENT, types.EXPORT_CSV_CLIENT_SUCESS, types.EXPORT_CSV_CLIENT_FAIL],
      promise: (client) => client.get(`/api/export/client/csv?access_token=${token}`)
  }
)

export const getSocialMediaFacebook  = (clientId, token, facebook_token) => (
  {
      types: [types.GET_SOCIAL_MEDIA, types.GET_SOCIAL_MEDIA_SUCCESS, types.GET_SOCIAL_MEDIA_FAIL],
      promise: (client) => client.get(`/api/social/facebook/${clientId}/pages?access_token=${token}&facebook_token=${facebook_token}`)
  }
)
export const setFacebookPages  = (token, facebook_token, listPages) => (
  {
      types: [types.SET_FACEBOOK_PAGES, types.SET_FACEBOOK_PAGES_SUCCESS, types.SET_FACEBOOK_PAGES_FAIL],
      promise: (client) => client.post(`/api/social/facebook/${facebook_token}/set/pages?access_token=${token}`, {listPages: listPages})
  }
)

export const getListCreators  = (token, clientId) => (
  {
      types: [types.GET_LIST_CREATORS, types.GET_LIST_CREATORS_SUCCESS, types.GET_LIST_CREATORS_FAIL],
      promise: (client) => client.get(`/api/client/get/${clientId}/creators?access_token=${token}`)
  }
)

export const getListCreatorsRewardees  = (token, clientId) => (
  {
      types: [types.GET_LIST_CREATORS_REWARDEES, types.GET_LIST_CREATORS_REWARDEES_SUCCESS, types.GET_LIST_CREATORS_REWARDEES_FAIL],
      promise: (client) => client.get(`/api/client/get/${clientId}/rewardees?access_token=${token}`)
  }
)

export const sendMailToCreator  = (token, data, access_time) => (
  {
      types: [types.SEND_MAILTO_CREATOR, types.SEND_MAILTO_CREATOR_SUCCESS, types.SEND_MAILTO_CREATOR_FAIL],
      promise: (client) => client.post(`/api/client/mail/send?access_token=${token}&access_time=${access_time}`, data )
  }
)
export const postFacebook  = (token, facebook_token, facebookContent) => (
  {
      types: [types.POST_FACEBOOK, types.POST_FACEBOOK_SUCCESS, types.POST_FACEBOOK_FAIL],
      promise: (client) => client.post(`/api/social/facebook/${facebook_token}/post?access_token=${token}`, facebookContent)
  }
)
export const postTwitter  = (token, twitterContent) => (
  {
      types: [types.POST_TWITTER, types.POST_TWITTER_SUCCESS, types.POST_TWITTER_FAIL],
      promise: (client) => client.post(`/api/social/twitter?access_token=${token}`, twitterContent)
  }
)
export const logoutTwitter  = (clientId) => (
  {
      types: [types.LOGOUT_TWITTER, types.LOGOUT_TWITTER_SUCCESS, types.LOGOUT_TWITTER_FAIL],
      promise: (client) => client.get(`/api/social/twitter/${clientId}/logout`)
  }
)
export const contentRewardedList  = (clientId, token) => (
  {
      types: [types.REWARD_LIST, types.REWARD_LIST_SUCCESS, types.REWARD_LIST_FAIL],
      promise: (client) => client.get(`/api/client/get/${clientId}/rewards?access_token=${token}`)
  }
)

export const getConfigureMail  = (token, clientId) => (
  {
      types: [types.GET_CONFIGURE_MAIL, types.GET_CONFIGURE_MAIL_SUCCESS, types.GET_CONFIGURE_MAIL_FAIL],
      promise: (client) => client.get(`/api/client/mail/${clientId}/configure?access_token=${token}`)
  }
)

export const updateConfigureMail  = (token, clientId, type, data) => ( 
  {
      types: [types.UPDATE_CONFIGURE_MAIL, types.UPDATE_CONFIGURE_MAIL_SUCCESS, types.UPDATE_CONFIGURE_MAIL_FAIL],
      promise: (client) => client.put(`/api/client/mail/${clientId}/${data.id}/edit?access_token=${token}&type=${type}`,data)
  }
)

export const exportCreator  = (token, clientId) => ( 
  {
      types: [types.EXPORT_CREATOR, types.EXPORT_CREATOR_SUCCESS, types.EXPORT_CREATOR_FAIL],
      promise: (client) => client.get(`/api/export/creator/${clientId}/excel?access_token=${token}`)
  }
)

export const exportRewardee  = (token, clientId) => ( 
  {
      types: [types.EXPORT_REWARDEE, types.EXPORT_REWARDEE_SUCCESS, types.EXPORT_REWARDEE_FAIL],
      promise: (client) => client.get(`/api/export/rewardee/${clientId}/excel?access_token=${token}`)
  }
)

export const importCreator  = (token, clientId, data) => ( 
  {
      types: [types.IMPORT_CREATOR, types.IMPORT_CREATOR_SUCCESS, types.IMPORT_CREATOR_FAIL],
      promise: (client) => client.post(`/api/import/creator/excel/${clientId}?access_token=${token}`,data)
  }
)

export const changeStatus  = (token, clientId, templateId, status) => ( 
  {
      types: [types.CHANGE_TEMPLATE_STATUS, types.CHANGE_TEMPLATE_STATUS_SUCCESS, types.CHANGE_TEMPLATE_STATUS_FAIL],
      promise: (client) => client.put(`/api/client/mail/${clientId}/change-status/${templateId}?access_token=${token}&status=${status}`)
    }
)

export const createTemplate  = (token, data) => ( 
  {
      types: [types.CREATE_TEMPLATE, types.CREATE_TEMPLATE_SUCCESS, types.CREATE_TEMPLATE_FAIL],
      promise: (client) => client.post(`/api/client/mail/create?access_token=${token}`, data)
    }
)

export const deleteTemplate  = (token, tempId, clientId) => ( 
  {
      types: [types.DELETE_TEMPLATE, types.DELETE_TEMPLATE_SUCCESS, types.DELETE_TEMPLATE_FAIL],
      promise: (client) => client.put(`/api/client/mail/${clientId}/delete/${tempId}?access_token=${token}`)
    }
)

export const changeSubscriptionStatus  = (token, data) => ( 
  {
      types: [types.CHANGE_SUBSCRIPTION_STATUS, types.CHANGE_SUBSCRIPTION_STATUS_SUCCESS, types.CHANGE_SUBSCRIPTION_STATUS_FAIL],
      promise: (client) => client.post(`/api/client/subscription?access_token=${token}`, data)
    }
)
export const searchInstagramMedia  = (data) => ( 
  {
      types: [types.GET_INSTAGRAM_MEDIA, types.GET_INSTAGRAM_MEDIA_SUCCESS, types.GET_INSTAGRAM_MEDIA_FAIL],
      promise: (client) => client.get(`/api/social/instagram/search/${data.clientId}?hashtags=${data.hashtags}&from=${data.from}&to=${data.to}`)
    }
)
export const getInstagramMediaByPage  = (data) => ( 
  {
      types: [types.GET_INSTAGRAM_MEDIA, types.GET_INSTAGRAM_MEDIA_SUCCESS, types.GET_INSTAGRAM_MEDIA_FAIL],
      promise: (client) => client.get(`/api/social/instagram/get/${data.clientId}?pageIndex=${data.pageIndex}&maxRecords=${data.maxRecords}&source=${data.source}`)
    }
)
export const getInstagramMedia  = (clientId) => ( 
  {
      types: [types.GET_INSTAGRAM_MEDIA, types.GET_INSTAGRAM_MEDIA_SUCCESS, types.GET_INSTAGRAM_MEDIA_FAIL],
      promise: (client) => client.get(`/api/social/instagram/${clientId}`)
    }
)
export const importFromInstagram  = (clientId, access_token, access_time , listId) => ( 
  {
      types: [types.IMPORT_INSTAGRAM_MEDIA, types.IMPORT_INSTAGRAM_MEDIA_SUCCESS, types.IMPORT_INSTAGRAM_MEDIA_FAIL],
      promise: (client) => client.post(`/api/social/instagram/import/${clientId}?access_token=${access_token}&access_time=${access_time}&listId=${listId}`)
    }
)
export const getHashtags  = (clientId, access_token) => ( 
  {
      types: [types.GET_CLIENT_HASHTAGS, types.GET_CLIENT_HASHTAGS_SUCCESS, types.GET_CLIENT_HASHTAGS_FAIL],
      promise: (client) => client.get(`/api/client/hashtags/${clientId}/get?access_token=${access_token}`)
    }
)
export const addHashtags  = (clientId, access_token, tag) => ( 
  {
      types: [types.ADD_CLIENT_HASHTAGS, types.ADD_CLIENT_HASHTAGS_SUCCESS, types.ADD_CLIENT_HASHTAGS_FAIL],
      promise: (client) => client.post(`/api/client/hashtags/${clientId}/add?access_token=${access_token}&tag=${tag}`)
    }
)
export const exportUsername  = (clientId, access_token, usernames) => ( 
  {
      types: [types.EXPORT_USERNAME, types.EXPORT_USERNAME_SUCCESS, types.EXPORT_USERNAME_FAIL],
      promise: (client) => client.post(`/api/export/instagram/${clientId}/excel?access_token=${access_token}`, { users: usernames} )
    }
)
export const resetExport  = () => ( 
  {
      types: [types.EXPORT_USERNAME]      
    }
)