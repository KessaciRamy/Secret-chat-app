import { v4 as uuidv4 } from 'uuid';
import discussionMemoryService from '../services/discussionMemory.service.js';
import { pool } from '../db.js';
import { genPseudo } from '../services/tempId.js';

export default function chatSocket(io){

    io.on('connection', (socket) => {
        console.log('connected', socket.id);

        socket.on('join_room', async ({ roomId }, ack) => {
            try{
                const db = await pool.query(
                    'SELECT max_users FROM discussions WHERE id = $1',[roomId]
                );
                if (db.rowCount === 0)
                    return ack?.({ error: 'Room not found'});

                // if no room => create room
                if (!discussionMemoryService.getRoom(roomId)) discussionMemoryService.createRoom(roomId);

                const room = discussionMemoryService.getRoom(roomId);
                //voit si le max_users est atteint
                if (Object.keys(room.users).length >= db.rows[0].max_users)
                    return ack?.({ error: 'Room full'});

                const tempId = uuidv4();
                const pseudo = genPseudo();
                const isFirstUser = Object.keys(room.users).length === 0;
                //on ajoute l utilisateur dans la discussion
                discussionMemoryService.addUserToRoom(roomId, tempId, {
                    pseudo,
                    socketId: socket.id,
                    isAdmin: isFirstUser // createur de la discussion = admin
                });

                socket.join(roomId);
                socket.tempId = tempId;
                socket.roomId = roomId;

                ack?.({
                    tempId,
                    messages: room.messages,
                    // ou bien users: Object.values(room.users)
                    users: discussionMemoryService.getMembers(roomId)
                });

                socket.to(roomId).emit('user_joined', {
                    tempId,
                    pseudo
                });
            } catch(err){
                console.error(err);
                ack?.({ error: 'Server error'});
            }
        });

        //Pour les messages
        socket.on('send_message', ({ text }) => {
            const { roomId, tempId } = socket;
            if (!roomId || !tempId) return;

            const room = discussionMemoryService.getRoom(roomId);
            if(!room) return;

            const msg = {
                id: uuidv4(),
                userId: tempId,
                text,
                createdAt: Date.now()
            };
            // ajoute le message
            discussionMemoryService.addMessage(roomId, msg);
            io.to(roomId).emit('new_message', msg);
        });

        //si l utilisateur sort de la conversation
        socket.on('disconnect', async () => {
            const { roomId, tempId } = socket;
            if(!roomId || !tempId) return;
            const room = discussionMemoryService.getRoom(roomId);
            const admin = room.users[tempId]?.isAdmin;
            //supprimer l utilisateur
            discussionMemoryService.removeUserFromRoom(roomId, tempId);
            
            socket.to(roomId).emit('user_left', { tempId });
            if(Object.keys(room.users).length === 0 || admin) {
                io.to(roomId).emit('room_closed');
                await pool.query(
                    'DELETE FROM discussions WHERE id = $1',[roomId]
                );
                discussionMemoryService.deleteRoom(roomId);
            }
        });
    });
}