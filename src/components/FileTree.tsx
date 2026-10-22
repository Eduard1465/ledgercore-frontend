import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FileNode } from '../data/files';

interface FileTreeProps {
  files: FileNode[];
  onSelect: (file: FileNode) => void;
  selectedFile: FileNode | null;
}

function FileTreeItem({ node, onSelect, selectedFile, depth = 0 }: { node: FileNode; onSelect: (f: FileNode) => void; selectedFile: FileNode | null; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isFolder = node.type === 'folder';
  const isSelected = selectedFile?.path === node.path;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelect(node);
    }
  };

  return (
    <div>
      <motion.div
        onClick={handleClick}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all text-sm ${
          isSelected
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'hover:bg-gray-800 text-gray-300'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        {isFolder && (
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="text-gray-500 text-xs"
          >
            ▶
          </motion.span>
        )}
        {!isFolder && <span className="text-xs text-gray-600 ml-4">•</span>}
        <span className="text-base">{node.icon || (isFolder ? '📁' : '📄')}</span>
        <span className="truncate">{node.name}</span>
      </motion.div>
      <AnimatePresence>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <FileTreeItem
                key={child.path}
                node={child}
                onSelect={onSelect}
                selectedFile={selectedFile}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FileTree({ files, onSelect, selectedFile }: FileTreeProps) {
  return (
    <div className="space-y-0.5">
      {files.map((file) => (
        <FileTreeItem
          key={file.path}
          node={file}
          onSelect={onSelect}
          selectedFile={selectedFile}
        />
      ))}
    </div>
  );
}
