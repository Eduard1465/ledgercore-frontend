import { Highlight, themes } from 'prism-react-renderer';
import type { FileNode } from '../data/files';

interface CodeViewerProps {
  file: FileNode | null;
}

export function CodeViewer({ file }: CodeViewerProps) {
  if (!file || !file.content) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <p>Select a file from the tree to view its contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border-b border-gray-700">
        <span className="text-lg">{file.icon}</span>
        <span className="text-sm text-gray-300 font-mono">{file.path}</span>
        <span className="ml-auto px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">
          {file.language || 'text'}
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <Highlight theme={themes.nightOwl} code={file.content} language={file.language || 'text'}>
          {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
            <pre className={`${className} p-4 text-sm leading-relaxed`} style={{ ...style, background: 'transparent', margin: 0 }}>
              {tokens.map((line: any, i: number) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  <span className="table-cell pr-4 text-right text-gray-600 select-none w-8 text-xs">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token: any, key: number) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
