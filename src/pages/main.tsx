import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../config/firebase';

export function Main (){
    const [user] = useAuthState(auth)

    return <div>Home Page welcome to the app {user?.displayName}</div>
}