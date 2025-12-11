
export function genTempId() {
  return 'u_' + Math.random().toString(36).slice(2, 10);
}

export function genPseudo() {
  return 'Anonyme' + Math.floor(1000 + Math.random()*9000);
}
