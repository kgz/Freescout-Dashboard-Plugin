import { ReactNode } from 'react';
import styles from './cards.module.scss';

type Cardprops = {
    children: ReactNode[] | ReactNode;
    headers: String[] | ReactNode[];
    style?: any;
}

const Card = (props: Cardprops) => {
    return (
        <div className={styles.card} style={props.style}>
            {/* foreach children */}

            {/* if type of children is reactnode */}
            {/* {props.children && typeof props.children === 'object' && props.children?.map((child: any, index:number) => { */}

            {(typeof props.children === 'object' && (props.children as ReactNode[])?.length || 0) > 0 && (props.children as ReactNode[])?.map((child: any, index: number) => {
                return (
                    <div key={index + "card"} className={styles.card__item} style={{ width: '100%' }}>
                        <div className={styles.card__item__header}>
                            {/* get header at index */}
                            {props.headers[(props.children as ReactNode[]).indexOf(child)]}
                        </div>
                        <div className={styles.card__item__content}>
                            {child}
                        </div>
                    </div>
                )
            }) || (
                    <div className={styles.card__item} style={{ width: '100%' }}>
                        <div className={styles.card__item__header}>
                            {/* get header at index */}
                            {props.headers[0]}
                        </div>
                        <div className={styles.card__item__content}>
                            {props.children}
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Card;