import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';

type RoomParams = {
	id: string;
}

export function AdminRoom() {
	//const {user} = useAuth();
	const room = useParams<RoomParams>();//pega parâmetros via URL
	const {title, questions} = useRoom(room.id);

	async function handleDeleteQuestion(questionId: string) {
		if(window.confirm('Tem certeza que deseja excluir esta pergunta?')){
			await database.ref(`rooms/${room.id}/questions/${questionId}`).remove();
		}
	}

	return(
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="LetmeAsk" />
					<div>
						<RoomCode code={room.id}/>
						<Button isOutlined>Encerrar sala</Button>
					</div>	
				</div>
			</header>
			<main>
				<div className="room-title">
					<h1>Sala {title}</h1>
					{ questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>
				
				<div className="question-list">
					{//o map funciona como um foreach
					questions.map(question => {
						return (
							<Question 
								key={question.id}
								content={question.content}
							author={question.author}
							>
							<button
								type="button"
								onClick={() => handleDeleteQuestion(question.id)}
							>
								<img src={deleteImg} alt="Remover pergunta" />
							</button>
							</Question>	
						);
					})}			
				</div>
			</main>
		</div>
	);
}