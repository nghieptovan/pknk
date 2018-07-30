import * as types from '../constants/DashboardActionTypes';

export const getDashboard = (token, id) => (
  {
    types: [types.GET_DASHBOARD, types.GET_DASHBOARD_SUCCESS, types.GET_DASHBOARD_FAIL],
    promise: (client) => client.get(`/api/client/get/dashboard/${id}?access_token=${token}`)
  }
)


export const getBill = () => (
  {
    types: [types.GET_BILL, types.GET_BILL_SUCCESS, types.GET_BILL_FAIL],
    promise: (client) => client.get(`/bill`)
  }
)