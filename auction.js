exports.getOrInit = (redisClient) => {
	return [{item :'Object A',
		description:'a fine object',
		currentBid:0,
		currentBidder:'No one',
		remainingTime:50},
		{item :'Object B',
		description:'a nice object',
		currentBid:0,
		currentBidder:'No one',
		remainingTime:50}
		];
}