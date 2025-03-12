import { useEffect, useState } from "react";

const useMediaQuery = (width: number): boolean => {
    const [isWidth, setIsWidth] = useState(window.innerWidth < width);
    // console.log( typeof width)
    useEffect(() => {
        // Отслеживаем изменение размера экрана здесь, моментально реагируя на любые его изменения
        const handleResize = () => setIsWidth(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        // Непременно удаляем обработчик, чтобы предотвратить утечку памяти
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // console.log(isWidth)

    return isWidth;
};

export default useMediaQuery