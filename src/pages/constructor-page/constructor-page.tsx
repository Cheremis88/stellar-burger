import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { selectFetchStatus, fetchIngredients } from '../../services/slice';
import styles from './constructor-page.module.css';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { useEffect } from 'react';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const [isIngredientsLoading, error] = useSelector(selectFetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <h3 style={{ margin: 'auto' }} className={`text text_type_main-large`}>
          {error}
        </h3>
      ) : (
        <main className={styles.containerMain}>
          <h1 className={`text text_type_main-large mt-10 mb-5`}>
            Соберите бургер
          </h1>
          <div className={styles.main}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
