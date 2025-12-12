import { API_URL } from "../config";
// it is working wohoooooooo
// add something to show the real time number of people joined in the chat
export async function fetchDiscussions() {
    try{
        const res = await fetch(`${API_URL}/api/discussions`);
        const data = await res.json();
        return data.rooms;
    }    catch(err){
        console.error('api erreur:', err);
        return [];
    }
}