import Pusher from 'pusher-js';

const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true
});

export default pusher;
