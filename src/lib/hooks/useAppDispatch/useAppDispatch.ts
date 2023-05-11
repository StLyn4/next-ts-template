import { useDispatch } from 'react-redux';

import { type AppDispatch } from 'app/redux/store';

/** Типизированная версия {@link useDispatch} */
const useAppDispatch: () => AppDispatch = useDispatch;

export default useAppDispatch;
