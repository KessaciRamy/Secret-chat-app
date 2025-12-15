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
                    'SELECT max_users, open FROM discussions WHERE id = $1',[roomId]
                );
                if (db.rowCount === 0)
                    return ack?.({ error: 'Room not found'});

                // if no room => create room
                if (!discussionMemoryService.getRoom(roomId)) discussionMemoryService.createRoom(roomId);

                const room = discussionMemoryService.getRoom(roomId);
                //voit si le max_users est atteint
                if (Object.keys(room.users).length >= db.rows[0].max_users)
                    return ack?.({ error: 'Room full'});

                //pour check si la discussion a deja ete commence si un user essaie de rentrer apres qu elle a commence
                if(db.rows[0].open === false)
                    return ack?.({ error: 'Discussion deja commencé'});

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
                socket.pseudo = pseudo;

                ack?.({
                    tempId,
                    started: room.started,
                    messages: room.messages,
                    // ou bien users: Object.values(room.users)
                    users: discussionMemoryService.getMembers(roomId)
                });

                socket.to(roomId).emit('user_joined', {
                    tempId,
                    pseudo
                });

                //notifier que le user a joint la conversation
                socket.to(roomId).emit('system_message', {
                    id: uuidv4(),
                    text: `${pseudo} a rejoint la discussion`,
                    createdAt: Date.now()
                });
            } catch(err){
                console.error(err);
                ack?.({ error: 'Server error'});
            }
        });
        //pour commencer une discussion
        socket.on('start_discussion', async () => {
            try{
            const { roomId, tempId } = socket;
            if(!roomId || !tempId) return;

            const room = discussionMemoryService.getRoom(roomId);
            if(!room) return;

            if(!room.users[tempId]?.isAdmin) return;

            room.started = true;

            io.to(roomId).emit('discussion_started');
            //fermer la discussions pour que personne ne puissent rentrer 
            await pool.query(
                'UPDATE discussions SET open = false WHERE id = $1',[roomId]
            );
            //test
            console.log('discussion closed yay');
        } catch(err){
            console.error('Failed to start the discussion', err);
        }
        })
        //Pour les messages
        socket.on('send_message', ({ text }) => {
            const { roomId, tempId } = socket;
            if (!roomId || !tempId) return;

            const room = discussionMemoryService.getRoom(roomId);
            if(!room) return;
            const user = room.users[tempId];

            const msg = {
                id: uuidv4(),
                userId: tempId,
                pseudo: user.pseudo,
                text,
                createdAt: Date.now()
            };
            // ajoute le message
            discussionMemoryService.addMessage(roomId, msg);
            io.to(roomId).emit('new_message', msg);
        });

        //si l utilisateur sort de la conversation
        socket.on('disconnect', async () => {
            const { roomId, tempId, pseudo } = socket;
            if(!roomId || !tempId) return;
            const room = discussionMemoryService.getRoom(roomId);
            if(!room) return;
            const admin = room.users[tempId]?.isAdmin;

            
            //supprimer l utilisateur
            discussionMemoryService.removeUserFromRoom(roomId, tempId);
            

            if(Object.keys(room.users).length === 0 || admin) {
                io.to(roomId).emit('room_closed');
                //force all sockets to leave and make sure no users are in there hihi
                /*const sockets = await io.in(roomId).fetchSockets();
                sockets.forEach(s => {
                    s.leave(roomId);
                    s.disconnect(true);
                });*/
                await pool.query(
                    'DELETE FROM discussions WHERE id = $1',[roomId]
                );
                discussionMemoryService.deleteRoom(roomId);
                return;
            }
            //check again ceci
            socket.to(roomId).emit('user_left', { 
                id: uuidv4(),
                text: `${pseudo} a quitté la discussion`}
            );
            console.log(
            `[DISCONNECT] ${pseudo} (${tempId}) left room ${roomId} | admin=${admin}`
            );
        });
    });
}