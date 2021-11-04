/* eslint-disable @typescript-eslint/no-empty-function */
import { Application, HTTPAPIPlugin } from 'lisk-sdk';

export const registerPlugins = (_app: Application): void => {
	_app.registerPlugin(HTTPAPIPlugin);
};
