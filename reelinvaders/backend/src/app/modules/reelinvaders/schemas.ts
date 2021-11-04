export const reelAccountSchema = {
	$id: 'lisk/reelinvaders/reelinvadersAccount',
	type: 'object',
	required: ['enemies'],
	properties: {
		enemies: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
	},
	default: { enemies: 12 },
};

export const spinreelSchema = {
	$id: 'lisk/reelinvaders/spinreelAsset',
	title:
		'Spinreel returns symbols, newcredits, amountWon, ammo, bonusFlag and determines if user has won credits.',
	type: 'object',
	required: [],
	properties: {
		dummy: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};
