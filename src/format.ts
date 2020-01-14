
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
			if (ch == stringStart && text[i - 1] != '\\') {
				inString = false
				inSpace = true
			}
			buffer += ch
			continue
		}
		if (ch == '{' || ch == '[') {
			addTabs()
			tabs++
			buffer += ch
			inSpace = true
			if (ch == '{') buffer += ' '
			continue
		}
		if (ch == '}' || ch == ']') {
			tabs--
			inSpace = true
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
		.replace(/ +\}/g, ' }')
		.replace(/\{ +\n/g, '{\n')
		.replace(/\n(\t*) +\}/g, '\n$1}')
}

const test = () => console.log(formatJSONP(`
// 审批流程配置
// 次文件包含了所有审批流程的信息，如果有变更，需要在此文件中做更改
// name	审批流程名称
// label	审批流程的label
// withShip	该审批流程是否必须有船舶信息
// broken	如果为true，则拒绝后直接强制放弃数据

[ 
	// 用户注册相关
{ name: "user.regist", label: "用户注册"  },
{ name: "user.regist.shipm", label: "船东公司注册", parent: "user.regist", userTypes: "any", broken: true  },
	{ name: "user.regist.seller", label: "设备商公司注册", parent: "user.regist", userTypes: "any", broken: true  },
{ name: "user.regist.crewm",label:        "船员管理公司注册", parent: "user.regist", userTypes: "any", broken: true  },

	// 船东公司基本信息设置
	{ name: "shipm.setting", label: "公司基本信息"  },
	{ name: "shipm.setting.desc.save", label: "公司简介设置", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.info.save", label: "保存公司信息", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.loginbg.save", label: "保存登录背景", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.logo.save", label: "保存公司logo", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.crewjobs.save", label: "保存允许的船员职务", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.department.create", label: "添加部门", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.department.update", label: "修改部门", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.department.remove", label: "删除部门", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.department.funcs.save", label: "保存部门的功能列表", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.user.create", label: "添加用户", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.user.update", label: "修改用户", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.user.remove", label: "删除用户", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.user.resetpwd", label: "重置用户密码", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
	{ name: "shipm.setting.user.ships.save", label: "保存用户管理的船舶", parent: "company.setting", userTypes: [ "shipm" ], broken: false  },
]

`))

// test()