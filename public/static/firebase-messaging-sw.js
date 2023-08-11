importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js')
firebase.initializeApp({
    messagingSenderId: '163243237865'
})

const messaging = firebase.messaging()
