const rooms = new Map();

/* structure des discussions
rooms.set(roomId, {
  users: {
    tempId: {
      pseudo: string,
      socketId: string,
      isAdmin: boolean
    }
  },
  messages: [
  {
    id: string,
    userId: tempId,
    text: string,
    createdAt: number
  }
  ],
  createdAt: number,
  started: false
})
*/

function createRoom(roomId) {
    if(!rooms.has(roomId)){
        rooms.set(roomId, {
            createdAt: Date.now(),
            users: {},
            messages: []
        });
    }
}
// supprime la discussion avec tout ces utilisateurs et messages
function deleteRoom(roomId){
    rooms.delete(roomId);
}

function getRoom(roomId){
    return rooms.get(roomId);
}

function addUserToRoom(roomId, tempId, user){
    const room = getRoom(roomId);
    if(!room) return;
    // user = { pseudo, socketId, isAdmin }
    room.users[tempId] = user;
}
//ca c pour si l utilisateur veut sortir ou bien se fait ban
function removeUserFromRoom(roomId,tempId){
    const room = getRoom(roomId);
    if(!room) return;
    delete room.users[tempId];
}

function addMessage(roomId, msg){
    const room = getRoom(roomId);
    if(!room) return;

    room.messages.push(msg);
    // pour pas saturer la ram avec plusieurs messages
    if(room.messages.length > 100) room.messages.shift();
}
function getMembers(roomId){
    const room = getRoom(roomId);
    if(!room) return [];

    return Object.entries(room.users).map(([tempId, user]) =>({
        tempId,
        pseudo: user.pseudo,
        isAdmin: user.isAdmin
    }));
}

function memory() {
    return Array.from(rooms.keys());
}

export default {
    createRoom,
    deleteRoom,
    getRoom,
    addUserToRoom,
    removeUserFromRoom,
    addMessage,
    getMembers,
    memory
};