
# Arcade Chain Games - Reelinvaders
Reelinvaders for Arcade Chain

[Backend documentation](https://github.com/Korben3/arcadechaingames/tree/main/reelinvaders/backend)

[Frontend documentation](https://github.com/Korben3/arcadechaingames/tree/main/reelinvaders/frontend)


### Demo

http://arcadechain.games/


### Instructions

Click "NEW ACCOUNT" and wait a few seconds for the account to receive ACG tokens. Copy the generated passphrase and keep it save. Click on "LOGIN" and select a game to play.
If you run the chain locally or funds are run out, you can use one of the below delegate passphrases:

``` 
{
  "passphrase": "alcohol tool card abstract since cushion feature woman script mask enlist glance",
  "address": "78b24c3eb2711d0982bc0331a2ab1f5470a37749"
 },
 {
  "passphrase": "brown cancel wild outside anger kid agree title travel zoo sport claw",
  "address": "4b491ec0c8a33602acf2775792c61ff87492d19f"
 },
 {
  "passphrase": "one rate leader butter wheat crane lunar fine ancient vicious december fetch",
  "address": "d8029cb3151d62505b95d3eb8863ae1ee699fc48"
 }
 ```
Press "SPIN REELS" to start playing, each spin costs 2 credits. You will need at least 2.05 credits to be able to play, this is because an account cannot reach 0 tokens in the new Core 3 system.

After pressing the spin button, a spinreel transaction is sent and the chain will respond with an event. This event contains a tx id and the symbols generated on the chain.
```
{
	symbols: symbols,
	transactionId: transaction.id.toString('hex'),
}
```

The spinreel asset from the reelinvaders module checks if the player has won ACG tokens from the deterministic random symbols and credits these tokens, if any, to the player.

The frontend checks for an event with the players tx id, once received it will start spinning the reels and show the combination to the player in the middle line of the reels. So the frontend is just an interface and a representation of the actions that happen on the blockchain. It's even possible to play the whole game from a command line interacting with the backend, but that's less fun.

Reelinvaders comes with a bonus game, for each "AMMO" symbol one shot is fired on the invaders automatically. If all alien invaders are gone, the player receives 10 bonus credits (ACG tokens). The amount of enemies left are stored in the players account on the blockchain, so it's possible to resume playing.

```
properties: {
	enemies: {
		dataType: 'uint32',
		fieldNumber: 1,
	},
},
default: { enemies: 12 },
```

A player can "CASH OUT" and start another game (when more are added) in the start screen. If a player runs out of tokens new tokens can be bought to continue playing.

The paytable shows how many credits can be earned for each combination of symbols. For example the jackpot is 3 Lisk symbols in a row and the player receives 50 credits!


### Links

Created with the [Lisk SDK](https://lisk.com/documentation/lisk-sdk/)

Retro bonus game graphics Licensed from [Ravenmore](https://ravenmore.itch.io/)
