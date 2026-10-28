// import Image from 'next/image';
import css from './About.module.css'


export default function About() {
    return (
        <section className={css.section} id="About">
            <div className={css.container}>
                {/* Content -- текстова частина секції */}
            <div className={css.content}>
            <div className={css.intro}>
                    <h2 className={css.title}>
                        Мандруй екологічно та відкривай нові горизонти
                    </h2>
                    <p className={`${css.description} ${css.text}`}>
                        Наш проєкт створений для тих, хто хоче досліджувати Україну відповідально. Ми допоможемо знайти унікальні маршрути, які поєднують красу природи, локальну культуру та принципи сталого туризму.
                    </p>
            </div>
            <ul className={css.advantages}>
                <li className={css.item}>
                            <h3 className={css.subtitle}>
                                Еко-маршрути по Україні
                            </h3>
                            <p className={css.text}>
                                Від Карпат до Чорного моря — добірка локацій, де можна подорожувати без шкоди для довкілля.
                            </p>
                </li>
                <li className={css.item}>
                            <h3 className={css.subtitle}>
                                Практичні екологічні поради
                            </h3>
                            <p className={css.text}>
                                Дізнайся, як зменшити свій екологічний слід під час мандрів, та зробити подорож комфортною й свідомою.
                            </p>
                </li>
                </ul>
                </div>
                {/* ЗОБРАЖЕННЯ */}
                <div
                    className={css.imgWrapper}
                    role="img"
                    aria-label="Фотографія лісу"
                />
                </div>
        </section>
    );
}