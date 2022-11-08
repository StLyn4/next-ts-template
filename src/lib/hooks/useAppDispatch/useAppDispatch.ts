import { useDispatch } from 'react-redux';

import { AppDispatch } from 'app/redux/store';

/** Типизированная версия {@link useDispatch} */
const useAppDispatch: () => AppDispatch = useDispatch;

export default useAppDispatch;
