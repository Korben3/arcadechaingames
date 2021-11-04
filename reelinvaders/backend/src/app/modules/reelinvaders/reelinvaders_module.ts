/* eslint-disable class-methods-use-this */

import {
	AfterBlockApplyContext,
	AfterGenesisBlockApplyContext,
	BaseModule,
	BeforeBlockApplyContext,
	TransactionApplyContext,
} from 'lisk-sdk';
import { SpinreelAsset } from './assets/spinreel_asset';
import { reelAccountSchema } from './schemas';
import mt19937 = require('@stdlib/random-base-mt19937');

export class ReelinvadersModule extends BaseModule {
	public actions = {};
	public reducers = {};
	public name = 'reelinvaders';
	public id = 1001;
	public accountSchema = reelAccountSchema;
	public transactionAssets = [new SpinreelAsset()];
	public events = ['spinreel'];

	// Lifecycle hooks
	public async beforeBlockApply(_input: BeforeBlockApplyContext) {}

	public async afterBlockApply(_input: AfterBlockApplyContext) {}

	public async beforeTransactionApply(_input: TransactionApplyContext) {}

	public async afterTransactionApply({ transaction, stateStore }: TransactionApplyContext) {
		if (transaction.moduleID === this.id && transaction.assetID === 1) {
			const lastBlockHeaders = stateStore.chain.lastBlockHeaders;
			const rngSeed = Math.abs(
				lastBlockHeaders[0].height + lastBlockHeaders[0].asset.seedReveal.readInt32BE(1),
			);
			let drng = mt19937.factory({
				seed: rngSeed,
			});
			const symbols = [(drng() % 5) + 1, (drng() % 5) + 1, (drng() % 5) + 1];
			this._channel.publish('reelinvaders:spinreel', {
				symbols: symbols,
				transactionId: transaction.id.toString('hex'),
			});
		}
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {}
}
