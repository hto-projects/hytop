/**
 * Keep adding to this file if you want to keep future events consistent
 */

/**
 * User prefix indicates that the event is listening from the front end.
 * Server prefix indicates the opposite.
 */
export const IoEventChannels = {
  CREATOR_JOINED_ROOM: "user:joined_room",
  GET_ROOM_INFO: "user:get_room_info",
  RECIEVE_MESSAGE: "user:recieve_message",
  USER_JOINED: "user:user_joined",
  RESET_ROOM_INFO: "user:reset_room_info",
  JOIN_ROOM_BY_ID: "server:join_room",
  LEAVE_ROOM: "server:leave_room",
  CREATE_ROOM: "server:create_room",
  SEND_INFO: "server:send_info",
  SEND_MESSAGE: "server:send_message",
} as const;

export type IoEventChannelNames = typeof IoEventChannels[keyof typeof IoEventChannels];