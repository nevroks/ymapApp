import classNames from 'classnames';
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './style.module.css'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';

type PopOverProps = HTMLMotionProps<'div'> & {
    isOpened: boolean
    setIsOpened: Dispatch<SetStateAction<boolean>>
    popOverAnchorRef: RefObject<HTMLElement>
    offset?: { top: number; left: number }
};

const PopOver = ({ children, className, popOverAnchorRef, isOpened, setIsOpened, offset = { top: 0, left: 0 }, ...rest }: PopOverProps) => {

    const popOverRef = useRef<HTMLDivElement | null>(null)
    const [popOverPosition, setPopOverPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });


    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
            popOverRef.current &&
            !popOverRef.current.contains(target) &&
            popOverAnchorRef.current &&
            !popOverAnchorRef.current.contains(target)
        ) {
            setIsOpened(false);
        }
    };

    useEffect(() => {
        if (isOpened) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpened]);
    useEffect(() => {
        if (isOpened && popOverAnchorRef.current && popOverRef.current) {
            const anchorRect = popOverAnchorRef.current.getBoundingClientRect();
            const popOverRect = popOverRef.current.getBoundingClientRect();

            // Вычисляем позицию поповера
            const top = anchorRect.bottom + offset.top; // Располагаем поповер под анкором
            // const left = (anchorRect.left + (anchorRect.width - popOverRect.width) / 2) + offset.left; // Центрируем поповер по горизонтали
            const left = 0

            setPopOverPosition({ top, left });
        }

    }, [popOverAnchorRef.current?.getBoundingClientRect().right, popOverAnchorRef.current?.getBoundingClientRect().bottom, isOpened, popOverAnchorRef.current, popOverRef.current])



    return (
        <AnimatePresence>
            {isOpened && (
                <motion.div
                    ref={popOverRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    // style={{
                    //     top: popOverPosition.top,
                    //     left: popOverPosition.left,
                    // }}
                    className={classNames(styles['PopOver'], {
                        [className!]: Boolean(className),
                    })}
                    {...rest}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
export default PopOver;
