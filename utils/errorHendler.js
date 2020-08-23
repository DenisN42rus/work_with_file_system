const ExitCode = {
	success: 0,
	error: 1
}

const errorHendeler = (err) => {
	console.log(err);
	process.exit(ExitCode.error);
}

module.exports = errorHendeler;