export function tempUser(req, res, next){
    const tempId = req.headers['x-temp-id'];
    if(tempId) req.tempUser = { tempId };
    next();
}