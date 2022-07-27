const example = (complex_object) => {
	return true
}

const goldman_reward_metadata = (complex_object) => {
	if(complex_object == undefined) {
		return undefined
	}

	return complex_object.processed.action_traces[0].inline_traces[0].act.data
}

const farmingtales_reward_metadata = (complex_object) => {
	if(complex_object == undefined) {
		return undefined
	}

	return complex_object.processed.action_traces[0].receipt.auth_sequence[0][1]
}

export {goldman_reward_metadata, farmingtales_reward_metadata, example}