import * as types from '../constants/DashboardActionTypes';

const initState = {
  error: '',
  clientInfo: null,
  bill: {}
}

export default function dashboard(state = initState, action) {
  switch (action.type) {
    case types.GET_BILL:
      return {
        ...state,
        loadingBill: 1
      }
    case types.GET_BILL_SUCCESS:
      return {
        ...state,
        loadingBill: 2,
        bill: action.result
      }
    case types.GET_BILL_FAIL:
      return {
        ...state,
        loadingBill: 3,
        bill: {},
        error: action.error
      }
    
    default:
     return state;
    }
}