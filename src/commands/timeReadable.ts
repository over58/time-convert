import * as vscode from 'vscode';
const  { commands, window } = vscode;

function fn() {
  const currentEditor = window.activeTextEditor;
  if (!currentEditor) {return;};

  const focus = currentEditor.selection;
  if (!focus || !focus.isSingleLine) {return;};

  const document = currentEditor.document;
  if (!document) {return;};

  const focusLine = document.lineAt(focus.start.line).text;
  if (!focusLine) {return;};

  const unixtime = focusLine.match(/\d{10,13}/g);
  if (unixtime) {
    let date: Date|undefined = undefined;
    if (unixtime[0].length === 10) {
      date = new Date(Number(unixtime[0]) * 1000);
    } else if (unixtime[0].length === 13) {
      date = new Date(Number(unixtime[0]));
    }

    if (date) {
      const dtf = new Intl.DateTimeFormat('en-ZA', {
        weekday: 'long', 
        hour12: false,
        year: 'numeric', 
        month: 'numeric', 
        day: '2-digit',
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric',
      });
      window.showInformationMessage(dtf.format(date));
    }
  }

  const timestamp = Date.parse(focusLine);
  if (timestamp) {window.showInformationMessage(`timestamp in second: ${String(timestamp/1000)}`);};
}

export default function(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('time-convert.timeReadable', fn)
    );
};