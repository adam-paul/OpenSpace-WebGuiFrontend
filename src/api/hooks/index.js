import { useSelector } from 'react-redux';

export const useLuaApi = () => {
  const luaApi = useSelector((state) => state.luaApi);
  return luaApi;
}; 