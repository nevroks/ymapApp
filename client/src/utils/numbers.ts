type toCurrencyArgs = {
    number: number,
    floor?: boolean
}

export const toCurrency = ({ number, floor = false }: toCurrencyArgs): string => {
    const curr = 'RUB';
    const languageFormat = 'ru-RU';

    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };

    const floorOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    };

    return Intl.NumberFormat(languageFormat, floor ? floorOptions : options).format(number);
};