import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from 'app/redux/store';

/** Типизированная версия {@link useSelector} */
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
