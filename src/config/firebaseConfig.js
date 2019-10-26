import Firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCJpQ42gEUwhPcZURiJ8kfXv-6gXculsLU",
  authDomain: "controle-financeiro-c115d.firebaseapp.com",
  databaseURL: "https://controle-financeiro-c115d.firebaseio.com",
  projectId: "controle-financeiro-c115d",
  storageBucket: "controle-financeiro-c115d.appspot.com",
  messagingSenderId: "809647219346",
  appId: "1:809647219346:web:caa7c47858284edc003c4b"
};

  const app = Firebase.initializeApp(firebaseConfig);
  export default db = app.database();
