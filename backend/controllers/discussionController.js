import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import discussionMemoryService from '../services/discussionMemory.service.js';
//fonction pour creer la discussion
export async function createDiscussion(req, res) {
    const { theme, subject, max_users } = req.body;
    
    //generer un id random pour la discussion
    const id = uuidv4();
    try {
        await pool.query(
            'INSERT INTO discussions(id, theme, subject, max_users) VALUES ($1, $2, $3, $4)',[id, theme || 'General', subject || null, max_users || 10]
        );
    //creer la discussion dans le front aussi
     discussionMemoryService.createRoom(id);
        return res.status(201).json({ roomId: id });
    
    } catch(err) {
        console.error(err);
        return res.status(500).json( { error: 'Database error'});
    }
}

//fonction pour afficher la liste des discussions
export async function listDiscussions(req, res) {
    try{
        const result = await pool.query('SELECT id, theme, subject, max_users FROM discussions');
        return res.json({ rooms: result.rows });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error'});
    }
}

//fonction pour fermer la discussion et supprimer the row de la table
export async function closeDiscussion(req, res) {
    const roomId = req.params.id;
    const tempId = req.body.tempId; //sent from the frontend
    try {
        //check si un id temporaire a ete creer
        if(!tempId) return res.status(401).json({ error: 'Missing temp user'});
        
        //check si la discussion est dans la memoire okokok
        const room = discussionMemoryService.getRoom(roomId);
        if (!room) return res.status(404).json({ error: 'Room not found' });
        
        // check si admin ok okok
        const user = room.users[tempId];
        if(!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Admin only'});
        }
        
        //supprimer les discussions de la ram et de la bdd
        await pool.query('DELETE FROM discussions WHERE id = $1', [roomId]);
        discussionMemoryService.deleteRoom(roomId);
        
        // notifier la socket
        // req.io.to(roomId).emit('room:closed');
        return res.json({ ok: true});
    } catch(err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error'});
    }

}