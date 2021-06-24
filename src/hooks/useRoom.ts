import { useEffect } from "react";
import { useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
	id: string;
	author: {
		name: string;
		avatar: string;
	}
	content: string;
	isAnswered: boolean;
	isHighLighted: boolean;
	likeCount: number;
	likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
	author: {
		name: string;
		avatar: string;
	}
	content: string;
	isAnswered: boolean;
	isHighLighted: boolean;
	likes: Record<string, {
		authorId: string;
	}>
}>

export function useRoom(roomId: string) {
	const { user } = useAuth();
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [title, setTitle] = useState('');

		//dispara um evento sempre que uma informação mudar
	//se os colchetes estiverm vazios essa função será executada somente uma fez, no carregamento da página
	useEffect(() => {
		//buscar as perguntas no banco de dados
		const roomRef = database.ref(`rooms/${roomId}`);

		roomRef.on('value', room => {
			const databaseRoom = room.val();
			const firebaseQuestions: FirebaseQuestions = databaseRoom.questions  ?? {};
			
			//As questões em forma de objeto, são convertida para array. 
			const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
				return {
					id: key,
					content: value.content,
					author: value.author,
					isHighLighted: value.isHighLighted,
					isAnswered: value.isAnswered,
					likeCount: Object.values(value.likes ?? {}).length,
					likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
				}
			})
			
			setTitle(databaseRoom.title);
			setQuestions(parsedQuestions);
		})

		return () => {
			roomRef.off('value');//remove todos os eventListener
		}

	}, [roomId, user?.id]);//toda vez que o ID mudar, esta função será executada
		//O user.id entrou aqui por ser uma variável externa ao useEffect

	return { questions, title}
}