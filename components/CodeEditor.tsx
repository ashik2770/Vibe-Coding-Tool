'use client';

import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  height?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'vs-dark',
  height = '100%',
}: CodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Monaco Editor
    editorRef.current = monaco.editor.create(containerRef.current, {
      value,
      language,
      theme,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      folding: true,
      renderWhitespace: 'selection',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
    });

    // Handle content changes
    const disposable = editorRef.current.onDidChangeModelContent((event) => {
      if (editorRef.current) {
        const newValue = editorRef.current.getValue();
        onChange(newValue);
      }
    });

    // Cleanup
    return () => {
      disposable.dispose();
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  // Update editor value when props change
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  // Update language when props change
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  // Update theme when props change
  useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setTheme(theme);
    }
  }, [theme]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    />
  );
}