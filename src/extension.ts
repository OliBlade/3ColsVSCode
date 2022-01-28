import * as vscode from 'vscode';
import find = require('lodash.find');
import { Snippet } from './3Cols/objects/snippet';
import { ThreeColsAPI } from './3Cols/api';

export function activate(context: vscode.ExtensionContext) {
	const api = new ThreeColsAPI();

	let getSnippetCommand = vscode.commands.registerCommand('3cols-vscode.3ColsGet', async () => {

		const apiKey = getAPIKey();
		if (apiKey) {
			const boards = await api.getBoards(apiKey);
			selectItemFromMenu('Select Board', boards, 'boardName', 'boardID').then(async board => {

				const categories = await api.getCategories(apiKey, board.boardID);
				selectItemFromMenu('Select Category', categories, 'name', 'categoryID').then(async category => {

					const subcategories = await api.getSubcategories(apiKey, category.categoryID);
					selectItemFromMenu('Select Subcategory', subcategories, 'name', 'subcategoryID').then(async subcategory => {

						const snippets = await api.getSnippets(apiKey, subcategory.subcategoryID);
						selectItemFromMenu('Select Snippet', snippets, 'name', 'snippetID').then(snippet => {
							openSnippet(snippet);
						}).catch();
					}).catch();

				}).catch();

			}).catch();
		}
	});

	let saveSnippetCommand = vscode.commands.registerCommand('3cols-vscode.3ColsSave', async () => {
		const apiKey = getAPIKey();
		if (apiKey) {
			const boards = await api.getBoards(apiKey);
			selectItemFromMenu('Select Board', boards, 'boardName', 'boardID').then(async board => {

				const categories = await api.getCategories(apiKey, board.boardID);
				selectItemFromMenu('Select Category', categories, 'name', 'categoryID').then(async category => {

					const subcategories = await api.getSubcategories(apiKey, category.categoryID);
					selectItemFromMenu('Select Subcategory', subcategories, 'name', 'subcategoryID').then(async subcategory => {

						const snippets = await api.getSnippets(apiKey, subcategory.subcategoryID);
						(snippets as any[]).unshift({ name: 'CREATE NEW +', snippetID: null });

						selectItemFromMenu('Select Snippet or Create New', snippets, 'name', 'snippetID').then(async snippet => {
							if (snippet.snippetID) {
								snippet.content = getEditorOrHighlightedText();
								snippet.language = getEditorLanguage();
								await api.updateSnippet(apiKey, snippet);
								vscode.window.showInformationMessage(`Saved - ${snippet.name}`);
							} else {
								getUserInput("Enter the name of the new Snippet", "Snippet name").then(async(snippetName: string) => {
									const snippet = new Snippet(subcategory.subcategoryID, snippetName, getEditorOrHighlightedText(), getEditorLanguage());
									await api.addSnippet(apiKey, snippet);
									vscode.window.showInformationMessage(`Saved - ${snippet.name}`);
								}).catch();
							}
						}).catch();
					}).catch();

				}).catch();

			}).catch();
		}
	});

	context.subscriptions.push(getSnippetCommand);
	context.subscriptions.push(saveSnippetCommand);
}

export function deactivate() { }

// Editor
function getUserInput(title: string, placeholder: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		vscode.window.showInputBox({ prompt: title, placeHolder: placeholder }).then(value => {
			if (value) {
				return resolve(value as string);
			}
			return reject();
		});
	});
}

function getEditorLanguage(): string {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const doc = editor.document;
		return doc.languageId;
	}
	return "text";
}

function getEditorOrHighlightedText() {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const selection = editor.selection;
		const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);
		return text;
	}
	return "";
}

function openSnippet(snippet: Snippet) {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const position = editor.selection.active;
		const line = document.lineAt(position.line);
		const start = line.range.start;
		const end = line.range.end;
		const range = new vscode.Range(start, end);
		const newText = snippet.content;
		editor.edit(editBuilder => {
			editBuilder.replace(range, newText);
		});
	}
	else {
		vscode.workspace.openTextDocument({
			language: snippet.language,
			content: snippet.content
		}).then(doc => {
			vscode.window.showTextDocument(doc);
		});
	}
}

function selectItemFromMenu<T>(title: string, items: T[], labelProp: string, idProp: string): Promise<T> {
	const menuItems = items.map((i: any) => { return { label: i[labelProp], id: i[idProp] }; });

	return new Promise<T>((resolve, reject) => {
		vscode.window.showQuickPick(menuItems, { title: title, placeHolder: title }).then(selectedItem => {
			if (selectedItem) {
				return resolve(find(items, (i: any) => i[idProp] === selectedItem.id) as T);
			}
			return reject();
		});
	});
}

function getAPIKey(): string {
	const configuration = vscode.workspace.getConfiguration("3cols");
	const apiKey = configuration.get("apiKey");

	if (!apiKey) {
		vscode.window.showErrorMessage("Please set your API key in settings. 3Cols -> ApiKey");
	}
	return apiKey as string;
}
