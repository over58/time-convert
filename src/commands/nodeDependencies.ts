import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class Dependency extends vscode.TreeItem{
  
  constructor (public readonly label:string, private version: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
    super(label, collapsibleState);
  }

  get tooltip():string{
    return `${this.label}-${this.version}`;
  }

  get description():string{
    return this.version;
  }

  iconPath={
    light: path.join(__filename, '..','..','resources', 'dependency.svg'),
    dark: path.join(__filename, '..','..','resources', 'dependency.svg')
  };

  
  // package.json menus  view/item/context  viewItem
  contextValue = 'dependency';

}


class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {
  private eventer: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this.eventer.event;
  
	constructor(public workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }
  
	refresh(): void {
    this.workspaceRoot = getWorkspaceRoot();
    this.eventer.fire();
	}

  getTreeItem (dep: Dependency): vscode.TreeItem {
    return dep;
  }

  getChildren (dep?: Dependency): Thenable<Dependency[]> {
    if(!this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependency in empty workspace');
      return Promise.resolve([]);
    }
    if(dep) {
      return Promise.resolve(this.getDepsInPackageJson(
        path.join(this.workspaceRoot, 'node_modules', dep.label, 'package.json')
      ));
    }else{
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      if(this.pathExists(packageJsonPath)) {
        return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
      }else{
        vscode.window.showInformationMessage('Workspace has no package.json');
        return Promise.resolve([]);
      }
    }

  }

  private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
    if(this.pathExists(packageJsonPath)) {
      const  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const toDep = (moduleName:string, version:string): Dependency => {
        if(this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
          return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed);
        }else{
          return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
        }
      };
      const deps = packageJson.dependencies 
        ? Object.keys(packageJson.dependencies).map(dep => toDep(dep, packageJson.dependencies[dep])) 
        : [];

      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map(dep => toDep(dep, packageJson.devDependencies[dep])) 
        : [];

      return deps.concat(devDeps);

    }else{
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (error) {
      return false;
    }
    return true;
  }
}

function getWorkspaceRoot () {
  let projectPath = '';
  let document = vscode.window.activeTextEditor?.document;

  if(vscode.workspace.workspaceFolders && document) {
    let workspaceFold = vscode.workspace.workspaceFolders.find(x=> document?.uri.path.startsWith(x.uri.path));
    projectPath = workspaceFold?.uri.path||'';
  }
  return projectPath;
}

export default function activate(context: vscode.ExtensionContext) {
  let projectPath = getWorkspaceRoot();
  console.log(projectPath);

  const nodeDependenciesProvider = new NodeDependenciesProvider(projectPath);
  vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
  vscode.commands.registerCommand('time-convert.nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
  vscode.commands.registerCommand('time-convert.nodeDependencies.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
  vscode.commands.registerCommand('time-convert.nodeDependencies.editEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	vscode.commands.registerCommand('time-convert.nodeDependencies.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));

}