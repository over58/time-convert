// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import hover from './commands/hover';
import webview from './commands/webview';
import timeReadable from './commands/timeReadable';
import progress from './commands/progress';
import comments from './commands/comments';
import nodeDependencies from './commands/nodeDependencies';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  console.log('Congratulations, your extension "time-convert" is now active!');

	let helloDisposable = vscode.commands.registerCommand('time-convert.helloWorld', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from time-convert!');
  });

  let getCurFilePathDisposable = vscode.commands.registerCommand('time-convert.getCurFilePath', (uri) => {
    vscode.window.showInformationMessage(`当前文件(夹)路径是：${uri ? uri.path : '空'}`);
  });
  hover(context);
  webview(context);
  timeReadable(context);

  progress(context);
  comments(context);
  nodeDependencies(context);

  context.subscriptions.push(helloDisposable, getCurFilePathDisposable);
  
  // 编辑器命令
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('time-convert.testEditorCommand', (textEditor, edit) => {
    console.log('您正在执行编辑器命令！');
    console.log(textEditor, edit);
  }));
}

// this method is called when your extension is deactivated
export function deactivate() {}
