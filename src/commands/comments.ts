import * as vscode from 'vscode';

let commandId = 1;

class NoteComment implements vscode.Comment{
  id: number;
  label: string|undefined;
  
  constructor (
    public body:string|vscode.MarkdownString,
    public mode:vscode.CommentMode,
    public author:vscode.CommentAuthorInformation,
    public parent?: vscode.CommentThread,
    public contextValue?: string
  ) {
    this.id = ++commandId;
  }
}

export default function activate(context: vscode.ExtensionContext) {
  const commentController = vscode.comments.createCommentController('comment-sample', 'Comment API Sample');
  context.subscriptions.push(commentController);

  commentController.commentingRangeProvider = {
    provideCommentingRanges: (document:vscode.TextDocument, token:vscode.CancellationToken) =>{
      const lineCount = document.lineCount;
      return [new vscode.Range(0,0, lineCount -1, 0)];
    }
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('time-convert.createNote', (reply: vscode.CommentReply) => {
      replyNote(reply);
    })
  );
}

function replyNote(reply: vscode.CommentReply) {
  const thread = reply.thread;
  const newComment = new NoteComment(reply.text, vscode.CommentMode.Preview, { name: 'vscode' }, thread, thread.comments.length ? 'canDelete' : undefined);
  if (thread.contextValue === 'draft') {
    newComment.label = 'pending';
  }

  thread.comments = [...thread.comments, newComment];
}