import { ButtonHTMLAttributes } from 'react';
import styles from './style.module.css'
import classNames from 'classnames';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
   
}

const Button = ({ children, className, ...props }: ButtonProps) => {
    return (
        <button className={classNames('text-small', styles['defaultBtnClass'], {
            [className!]: Boolean(className),
        })} {...props}>
            {children}
        </button>
    );
}

export default Button;
