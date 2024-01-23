import {initializeApp} from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyB6jTLQpqQ8dUh0WgMkYTNvQwYkMXcQH4k",
    authDomain: "react-course-55fc4.firebaseapp.com",
    projectId: "react-course-55fc4",
    storageBucket: "react-course-55fc4.appspot.com",
    messagingSenderId: "890590497903",
    appId: "1:890590497903:web:709cd9aeea6343800e919a"
};

initializeApp(firebaseConfig)

export const auth = getAuth();
export const provider = new GoogleAuthProvider()


