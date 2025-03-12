
import { ReturningOfferType } from '../../utils/api/api';
import styles from "./style.module.css"
import { toCurrency } from '../../utils/numbers';
import { useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Button, PopUp } from '../ui';
import CloseIcon from './../../assets/icons/crossIcon.svg'
import MetroIcon from './../../assets/icons/moscowMetroIcon.svg'

type PlacePopUpProps = {
    isOpen: boolean;
    onClose: () => void;
    mark: ReturningOfferType
}

const PlacePopUp = ({ isOpen, onClose, mark }: PlacePopUpProps) => {

    const [currentPictureUrl, setCurrentPictureUrl] = useState<string | null>(mark.picture[0] || null)

    const tubeParam = mark.param.find(param => param.name === 'Метро')
    const isRent = mark.name.toLocaleLowerCase().includes('аренда')

    console.log(mark.description)
    return (
        <PopUp isOpen={isOpen} onClose={onClose}>
            <motion.div layout className={styles['PlacePopUp-content']}>
                <div className={styles['PlacePopUp-header']}>
                    <p className='text-extra-small'>{mark.vendor}</p>
                    <img onClick={onClose} src={CloseIcon} alt="" />
                </div>
                <div className={styles['PlacePopUp-body']}>
                    <div className={styles['PlacePopUp-body-preview']}>
                        <h2>{mark.name}</h2>
                        {tubeParam && <div style={{ display: 'flex', alignItems: 'center', columnGap: '4px' }}>
                            <img style={{ height: 15 }} src={MetroIcon} alt="" />
                            <p className='text-small'>
                                Метро: {tubeParam['#text']}
                            </p>
                        </div>
                        }
                        <p className='text-large'>{isRent ? 'МАП - ' : 'Цена: '}{toCurrency({number:mark.price})}</p>
                        {currentPictureUrl ?
                            <div className={classNames(styles['PlacePopUp-body-preview-images'])}>
                                <div className={classNames(styles['PlacePopUp-body-preview-images-current'])}>
                                    <img src={currentPictureUrl} alt="" />
                                </div>
                                <div className={classNames(styles['PlacePopUp-body-preview-images-list'])}>
                                    {mark.picture.length > 1 && mark.picture.map((picture, index) => {
                                        return (
                                            <div className={classNames(styles['PlacePopUp-body-preview-images-list-item'], {
                                                [styles.selected]: picture === currentPictureUrl
                                            })}
                                                key={index} onClick={() => setCurrentPictureUrl(picture)}>
                                                <img src={picture} alt="" />
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                            :
                            <div className={classNames(styles['PlacePopUp-body-preview-images'], styles['empty'])}>

                            </div>
                        }
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div className={styles['PlacePopUp-body-description']}>
                            <p className={classNames('text-medium', styles['PlacePopUp-body-description-text'])}
                                dangerouslySetInnerHTML={{ __html: mark.description }}
                            />
                            <ul className={styles['PlacePopUp-body-description-more']}>
                                <li>
                                    <p className='text-medium'>Детали:</p></li>
                                {mark.param.map((param, index) => {
                                    return (
                                        <li key={index}>
                                            <p className='text-medium'>
                                                {param.name}: {param['#text']}
                                            </p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <a style={{ position: 'absolute', bottom: 0, right: 20 }} href={mark.url} target='_blank'>
                            <Button>
                                <p className='text-medium'>Подробнее</p>
                            </Button>
                        </a>

                    </div>

                </div>
            </motion.div>
        </PopUp>
    );
}

export default PlacePopUp;
