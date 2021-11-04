/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { ReelinvadersModule } from './modules/reelinvaders/reelinvaders_module';

export const registerModules = (_app: Application): void => {
	_app.registerModule(ReelinvadersModule);
};
