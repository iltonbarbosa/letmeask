import firebase from "firebase";
import { useEffect } from "react";
import { useState } from "react";
import { createContext, ReactNode } from "react";
import { auth } from "../services/firebase";

type User = {
	id: string;
	name: string;
	avatar: string;
}

type AuthContextType = {
	user: User | undefined;
	signWithGoogle: () => Promise<void>; //função sem retorno
}

type AuthContextProviderProps = {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps){
	const [user, setUser] = useState<User>();

	useEffect(() => {//Se aperta o F5 não perde a sessão do usuário logado
		const unsubscribe = auth.onAuthStateChanged(user => {
			if(user){
				const { displayName, photoURL, uid } = user

				if(!displayName || !photoURL){
					throw new Error('Informações não encontradas na conta da Google');
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL
				})
			}
		})

		return () => {//toda vez que criarmos um listener, precisamos criar este retorno
			unsubscribe();
		}
	}, []);

	async function signWithGoogle(){
		const provider = new firebase.auth.GoogleAuthProvider();

		const result = await auth.signInWithPopup(provider);

		if(result.user){
			const { displayName, photoURL, uid } = result.user;

			if(!displayName || !photoURL){
				throw new Error('Informações não encontradas na conta da Google');
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: photoURL
			})
		}
	}
	
	return (
		<AuthContext.Provider value={{ user, signWithGoogle }}>
			{props.children}
		</AuthContext.Provider>
	);
} 