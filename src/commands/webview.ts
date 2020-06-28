import * as vscode from 'vscode';
const path = require('path');

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function getWebContent (webview: vscode.Webview, context: vscode.ExtensionContext) {
  const nonce = getNonce();
  console.log(nonce);
  // Local path to main script run in the webview
  const scriptPathOnDisk = vscode.Uri.file(
    path.join(context.extensionPath,'./src/view/webview.js')
  );

  const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
  console.log('=======',scriptUri);

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src unsafe-inline eval 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script nonce="${nonce}" src="${scriptUri}"> </script>
    </head>
    <body>
    hello webview page
    <input type="date" id="date" value=""/>
    <input type="time" id="time" value="" />
    <input type="button" value="获取时间戳" onclick="date2stamp()" />
    <p id="output-timestamp"></p>
    </body>
  </html>
`;
}

export default function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('time-convert.openWebview', function(uri){
      const panel = vscode.window.createWebviewPanel(
        'testWebview', // viewType
        "WebView演示", // 视图标题
        vscode.ViewColumn.Beside, // 显示在编辑器的哪个部位
        {
            enableScripts: true, // 启用JS，默认禁用
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, 'src'))
          ]
        }
      );
      panel.webview.html = getWebContent(panel.webview, context);
    }));
};