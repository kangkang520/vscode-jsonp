// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { formatJSONP } from './format'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.languages.registerDocumentFormattingEditProvider('jsonp', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			let text = document.getText()
			const edit = new vscode.TextEdit(new vscode.Range(new vscode.Position(0, 0), document.positionAt(text.length)), formatJSONP(text))
			return [edit]
		}
	});
}

export function deactivate() { }
