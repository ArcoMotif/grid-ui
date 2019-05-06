import Clef from './clefService'

export const selectRequest = index => {
  return {
    type: '[REQUESTS]:QUEUE:SELECT_REQUEST',
    payload: { index }
  }
}

export const addRequest = (data, client) => {
  return async (dispatch, getState) => {
    const request = { ...data, client }
    // Remove unneeded jsonrpc value
    // if (request.jsonrpc) {
    //   delete request.jsonrpc
    // }
    dispatch({
      type: '[REQUESTS]:QUEUE:ADD_REQUEST',
      payload: { request }
    })
    const { selectedRequest } = getState().requests
    if (!selectedRequest) {
      dispatch(selectRequest(0))
    }
  }
}

export const requestDone = id => {
  return async (dispatch, getState) => {
    const { requests } = getState()
    const { queue, selectedRequest } = requests
    let nextSelected = selectedRequest
    if (nextSelected > queue.length - 2) {
      nextSelected = queue.length - 3
    }
    dispatch({
      type: '[REQUESTS]:QUEUE:REQUEST_DONE',
      payload: { id, nextSelected }
    })
  }
}

export const addNotification = notification => {
  return {
    type: '[REQUESTS]:NOTIFICATIONS:ADD',
    payload: { notification }
  }
}

export const clearNotification = index => {
  return {
    type: '[REQUESTS]:NOTIFICATIONS:CLEAR',
    payload: { index }
  }
}

export function createListeners(client, dispatch) {
  client.on('request', data => dispatch(addRequest(data, client.name)))
  client.on('notification', data => {
    const type = data.method === 'ui_showError' ? 'error' : 'info'
    const { text, info } = data.params[0]
    const notification = { type, text, info, client: client.name }
    dispatch(addNotification(notification))
  })
}

export function removeListeners(client) {
  client.removeAllListeners('request')
  client.removeAllListeners('notification')
}