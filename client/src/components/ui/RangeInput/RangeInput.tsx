import classNames from "classnames";

import styles from './style.module.css'
import { InputHTMLAttributes } from "react";

type RangeInputProps = InputHTMLAttributes<HTMLInputElement> & {
    min: number;
    max: number;
    step: number;
}

const RangeInput = ({ max, min, step, className, ...rest }: RangeInputProps) => {
    return (
        <input
            className={classNames(styles['RangeInput'], {
                [className!]: Boolean(className),
            })}
            type="range" min={min} max={max} step={step} {...rest} />
    );
}

export default RangeInput;
