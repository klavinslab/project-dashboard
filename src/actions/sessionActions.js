export const SESSION_LOGIN = 'SESSION_LOGIN';
export const SESSION_LOGOUT = 'SESSION_LOGOUT';
export const GET_PROJECT = 'GET_PROJECT';
export const PROTEIN = 'PROTEIN';
export const STRAIN = 'STRAIN';

export const login = () => dispatch =>
  dispatch({
    type: SESSION_LOGIN
  });

export const logout = () => dispatch =>
  dispatch({
    type: SESSION_LOGOUT
  });

export const switchProject = project => dispatch =>
  dispatch({
    type: GET_PROJECT,
    payload: project
  });

export const proteinDesign = () => dispatch =>
  dispatch({
    type: PROTEIN
  });
export const strainConstruction = () => dispatch =>
  dispatch({
    type: STRAIN
  });
