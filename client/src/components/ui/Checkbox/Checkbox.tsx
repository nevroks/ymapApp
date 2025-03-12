import { ChangeEventHandler, FC, HTMLProps } from 'react'
import styles from './style.module.css'
import classNames from 'classnames'

type CheckboxProps = Omit<HTMLProps<HTMLInputElement>, "type"> & {
    checked: boolean
    handleChange: ChangeEventHandler<HTMLInputElement> | undefined
}

const Checkbox: FC<CheckboxProps> = ({ checked, handleChange, ...rest }) => {
    return (
        <input
            {...rest}
            className={classNames(styles['checkbox'], {
                [styles.checked]: checked
            })}
            type='checkbox'
            checked={checked}
            onChange={handleChange}
        />
    )
}

export default Checkbox