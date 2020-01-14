
export function formatJSONP(text: string) {
	let buffer = ''
	let inSpace = false, inString = false, stringStart = ''
	let breakLine = false
	let tabs = 0

	function addTabs() {
		if (!breakLine) return
		for (let i = 0; i < tabs; i++) {
			buffer += '\t'
		}
		breakLine = false
	}

	for (let i = 0; i < text.length; i++) {
		const ch = text[i]
		//如果正在空白中
		if (inSpace) {
			if (ch == ' ' || ch == '\t' || ch == '\r') continue
			inSpace = false
		}
		if (inString) {
			if (ch == stringStart && text[i - 1] != '\\') inString = false
			buffer += ch
			continue
		}
		if (ch == '{' || ch == '[') {
			addTabs()
			tabs++
			buffer += ch
			if (ch == '{') buffer += ' '
			continue
		}
		if (ch == '}' || ch == ']') {
			tabs--
			addTabs()
			if (ch == '}') buffer += ' '
			buffer += ch
			continue
		}
		if (ch == ':') {
			buffer += ch + ' '
			inSpace = true
			continue
		}
		if (ch == ',') {
			buffer += ch + ' '
			inSpace = true
			continue
		}
		if (ch == '/' && text[i + 1] == '/') {
			addTabs()
			buffer += '// '
			inSpace = true
			i++
			continue
		}
		if (ch == ' ' || ch == '\t' || ch == '\r') {
			inSpace = true
			if (ch != '\r') buffer += ch
			continue
		}
		if (ch == '"' || ch == "'") {
			addTabs()
			buffer += ch
			stringStart = ch
			inString = true
			continue
		}
		if (ch == '\n') {
			breakLine = true
			inSpace = true
			buffer += ch
			continue
		}
		addTabs()
		buffer += ch
	}
	return buffer
		.replace(/, \n/g, ',\n')
		.replace(/\{ +/g, '{ ')
		.replace(/\{ +\n/g, '{\n')
		.replace(/\n(\t*) +\}/g, '\n$1}')
}

// console.log(formatJSONP(`
 
// {      id:1,        name:'343', age:333
// 	test:"fds",
// 	abc:{
// "fdfds":3343,
// 		"xxxx":true,
// 	}
//  }

// `))