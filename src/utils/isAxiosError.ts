import { AxiosError } from 'axios';

/**
 * Establishes whether the provided element is an error thrown by Axios.
 *
 * @param {*} error
 * @returns {error is AxiosError}
 */
function isAxiosError(error: any) : error is AxiosError {
  return error && error.isAxiosError === true;
}

export default isAxiosError;
