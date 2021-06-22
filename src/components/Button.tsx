import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps){
	return (
		<button className="button" {...props} />// estes pontos são conhecidos como 'spred operation' seria como percorrer um array de propriedades
	)
}