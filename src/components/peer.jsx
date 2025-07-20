// src/utils/peer.js
import Peer from 'peerjs';

export const createPeer = (id = undefined) => {
 
  return new Peer(id, {
    host: '192.168.121.242',
    port: 9000,
    path: '/',
  }); // uses PeerJS default cloud server
};