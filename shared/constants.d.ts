/**
 * Keep adding to this file if you want to keep future events consistent
 * Also this one was created to share constants between front end and back end. There is a constants file that is only in the front end
 */
/**
 * User prefix indicates that the event is listening from the front end.
 * Server prefix indicates the opposite.
 */
declare const IoEventChannels: {
    readonly CREATED_ROOM: "user:joined_room";
    readonly GET_ROOM_INFO: "user:get_room_info";
    readonly RECIEVE_MESSAGE: "user:recieve_message";
    readonly USER_JOINED: "user:user_joined";
    readonly RESET_ROOM_INFO: "user:reset_room_info";
    readonly GET_LEAVING_USER: "user:get_leaving_user";
    readonly ROOM_DOESNT_EXISTS: "user:room_doesnt_exists";
    readonly ALL_ROOMS_UPDATED: "user:all_rooms_updated";
    readonly JOIN_ROOM_BY_ID: "server:join_room";
    readonly LEAVE_ROOM: "server:leave_room";
    readonly CREATE_ROOM: "server:create_room";
    readonly SEND_INFO: "server:send_info";
    readonly SEND_MESSAGE: "server:send_message";
};
type IoEventChannelNames = typeof IoEventChannels[keyof typeof IoEventChannels];
export { IoEventChannels, IoEventChannelNames, };
//# sourceMappingURL=constants.d.ts.map