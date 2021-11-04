import { BaseAsset, ApplyAssetContext, ValidateAssetContext, transactions } from 'lisk-sdk';
import { spinreelSchema } from '../schemas';
import { reelinvadersAccountProps } from '../../../types';
import mt19937 = require('@stdlib/random-base-mt19937');

export class SpinreelAsset extends BaseAsset {
	public name = 'spinreel';
	public id = 1;
	public schema = spinreelSchema;

	public validate({ transaction }: ValidateAssetContext<{}>): void {
		if (transaction.fee !== BigInt(transactions.convertLSKToBeddows('2'))) {
			throw new Error('Incorrect transaction fee, use a fee of 2 ACG.');
		}
	}

	public async apply({
		transaction,
		stateStore,
		reducerHandler,
	}: ApplyAssetContext<{}>): Promise<void> {
		// get a positive 32bit seed based on seedReveal+height and create 3 random symbol numbers
		const lastBlockHeaders = stateStore.chain.lastBlockHeaders;
		const rngSeed = Math.abs(
			lastBlockHeaders[0].height + lastBlockHeaders[0].asset.seedReveal.readInt32BE(1),
		);

		let drng = mt19937.factory({
			seed: rngSeed,
		});
		const symbols = [(drng() % 5) + 1, (drng() % 5) + 1, (drng() % 5) + 1];

		// determine if users wins credits
		let prizesTotal = 0;
		let randSymbolsString = symbols.toString();
		let cherries = 0;
		let ammo = 0;
		const tripleWins = {
			'1,1,1': 50,
			'2,2,2': 5,
			'4,4,4': 3,
			'5,5,5': 8,
		};

		if (tripleWins[randSymbolsString]) {
			prizesTotal = tripleWins[randSymbolsString];
			if (randSymbolsString === '4,4,4') {
				ammo = 3;
			}
		} else {
			cherries = (randSymbolsString.match(/2/g) || []).length;
			ammo = (randSymbolsString.match(/4/g) || []).length;
			prizesTotal = cherries + ammo;
		}

		// if a user has ammo symbols, deduct those from enemies in account. If <1 add 10 to prizesTotal and reset enemies
		if (ammo) {
			const senderAccount = await stateStore.account.get<reelinvadersAccountProps>(
				transaction.senderAddress,
			);
			if (senderAccount.reelinvaders.enemies - ammo < 1) {
				senderAccount.reelinvaders.enemies = 12;
				prizesTotal += 10;
			} else {
				senderAccount.reelinvaders.enemies -= ammo;
			}
			await stateStore.account.set(transaction.senderAddress, senderAccount);
		}

		// add the total prizes won to user if any
		if (prizesTotal) {
			await reducerHandler.invoke('token:credit', {
				address: transaction.senderAddress,
				amount: BigInt(transactions.convertLSKToBeddows(prizesTotal.toString())),
			});
		}
	}
}
