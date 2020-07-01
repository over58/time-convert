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

  const scriptUri = webview.asWebviewUri(vscode.Uri.file(
    path.join(context.extensionPath,'./src/view/webview.js')
  ));

  const bootstrapCssUri = webview.asWebviewUri(vscode.Uri.file(
    path.join(context.extensionPath,'./src/view/bootstrap.min.css')
  ));

  const cssUri = webview.asWebviewUri(vscode.Uri.file(
    path.join(context.extensionPath, './src/view/webview.css')
  ));
  

  console.log(cssUri);
  
  // <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src unsafe-inline eval 'nonce-${nonce}';">
  // <script nonce="${nonce}" src="${scriptUri}"></script>

  webview.onDidReceiveMessage(function(message){
    console.log('====onDidReceiveMessage===', message);
    switch (message.command) {
      case 'a':
        
        break;
    
      default:
        break;
    }
  });
  
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="${cssUri}" rel="stylesheet" />
    <link href="${bootstrapCssUri}" rel="stylesheet" />
    </head>
    <body>
      <div class="wrapper">
        <div class="divider">
          <div class="title">
            时间转时间戳
          </div>
        </div>
        <div class="form-group">
          <input type="datetime-local" class="form-control" format="format="yyyy-MM-dd hh:mm:ss"" id="datetime-local" value="" />
        </div>
        <div class="form-group">
          <input type="button" class="btn btn-primary" value="获取时间戳" id="date2stamp"/>
        </div>
        <div class="form-group">
          <input class="form-control" id="output-timestamp"/>
        </div>
      </div>
      
      <div class="wrapper">
        <div class="divider">
          <div class="title">
            时间戳转时间
          </div>
        </div>
        <div class="form-group">
          <input type="text" id="timestamp" class="form-control">
        </div>
        <div class="form-group">
          <input type="button" class="btn btn-primary" value="时间戳格式化" id="stamp2date"/>
        </div>
        <div class="form-group">
          <input id="output-date" class="form-control"/>
        </div>
      </div>
      <script src="${scriptUri}"></script>
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