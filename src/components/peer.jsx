import  { Peer } from 'peerjs';
import {  db,auth } from '../firebase';
import { doc, setDoc,getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
const savedPeerId = localStorage.getItem('peerId');
const peer = new Peer(savedPeerId || undefined);
peer.on('open', async (id) => {
  localStorage.setItem('peerId', id);

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.warn('User not authenticated — cannot save peer ID.');
      return;
    }

    try {
      const callRef = doc(db, 'calls', user.uid);
      const callSnap = await getDoc(callRef);

      if (!callSnap.exists()) {
        // New call doc with caller peer ID
        await setDoc(callRef, {
          uid: user.uid,
          peerId: id,
          receiverPeerId: null,
          active: true,
          timestamp: Date.now()
        });
        console.log('Caller Peer ID saved to Firestore:', id);
      } else {
        // Keep the existing document if already present
        console.log('Call document already exists.');
      }
    } catch (error) {
      console.error('Error saving peer ID to Firestore:', error.message);
    }
  });
});

export default peer;
