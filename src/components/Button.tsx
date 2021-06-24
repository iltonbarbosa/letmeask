import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss';

//O parâmetro isOutlined é opcional
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	isOutlined?: boolean
};

//todos os demais parâmetros que não for o isOutlined, ficam no props
export function Button({ isOutlined = false, ...props}: ButtonProps){
	return (
		<button 
			className={`button ${isOutlined ? 'outlined' :''}`} 
			{...props} 
		/>// estes pontos são conhecidos como 'spred operation' seria como percorrer um array de propriedades
	)
}