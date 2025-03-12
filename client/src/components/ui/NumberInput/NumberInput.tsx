import { ChangeEvent, HTMLProps, useEffect, useState } from 'react';
import styles from './style.module.css'

type NumberInputProps = Omit<HTMLProps<HTMLInputElement>, 'type' | 'value'> & {
    controlledValue?: number;
    onChange?: (value: any) => void;
}

const NumberInput = ({ controlledValue = 0, onChange, ...rest }: NumberInputProps) => {

    const [value, setValue] = useState(controlledValue.toString()); // Начальное значение в виде строки

    useEffect(() => {
        const formattedValue = controlledValue.toLocaleString('ru-RU').replace(/,/g, ' ');
        setValue(formattedValue);
    }, []); 
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.replace(/\s+/g, '');

        if (inputValue === '') {
            // Если поле пустое, устанавливаем значение 0
            setValue('0');
            onChange && onChange(0); // Вызываем onChange с 0
        } else if (!isNaN(Number(inputValue))) {
            // Если это число, форматируем его
            const numberValue = Number(inputValue);
            const formattedValue = numberValue.toLocaleString('ru-RU').replace(/,/g, ' ');
            setValue(formattedValue);
            onChange && onChange(numberValue); // Вызываем onChange с числом
        } else {
            // Если это не число, устанавливаем значение 0
            setValue('0');
            onChange && onChange(0); // Вызываем onChange с 0
        }
    };
    return (
        <input
        className={styles['NumberInput']}
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Введите число"
            {...rest}
        />
    );
};

export default NumberInput;
