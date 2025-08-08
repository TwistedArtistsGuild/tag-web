/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/**
 * WysiwygTextArea - A multi-line rich text editor component
 * Perfect for longer content like descriptions, blog posts, etc.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.value - Initial/controlled value for the editor
 * @param {function} props.onChange - Callback function when content changes
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.style - Additional style properties for the container
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.readOnly - Whether editor is read-only
 * @param {Object} props.toolbar - Custom toolbar configuration
 * @param {string} props.theme - Theme for the editor ('light' or 'dark')
 * @param {number} props.minHeight - Minimum height of the editor in pixels
 * @param {number} props.maxHeight - Maximum height of the editor in pixels (0 for unlimited)
 */
const WysiwygTextArea = ({
  value = "",
  onChange = () => {},
  placeholder = "Write something...",
  style = {},
  className = "",
  readOnly = false,
  toolbar = null,
  theme = "light",
  minHeight = 150,
  maxHeight = 400
}) => {
  const quillRef = useRef(null);
  const [editorValue, setEditorValue] = useState(value);
  
  // Default toolbar options for text area editor - full functionality
  const defaultToolbar = [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean'] // remove formatting
  ];
  
  // Use custom toolbar if provided, otherwise use default
  const toolbarOptions = toolbar || defaultToolbar;
  
  // Apply dark theme if specified
  useEffect(() => {
    const editor = document.querySelector('.wysiwyg-text-area');
    if (editor) {
      if (theme === 'dark') {
        editor.classList.add('quill-dark');
      } else {
        editor.classList.remove('quill-dark');
      }
    }
  }, [theme]);
  
  // Configure Quill modules
  const modules = {
    toolbar: toolbarOptions,
    clipboard: {
      // Allow pasted content to maintain formatting
      matchVisual: false
    }
  };
  
  // Handle editor content changes
  const handleChange = (content) => {
    setEditorValue(content);
    onChange(content);
  };
  
  // Calculate editor style with min/max height constraints
  const editorStyle = {
    minHeight: `${minHeight}px`,
    maxHeight: maxHeight > 0 ? `${maxHeight}px` : 'none',
    ...style
  };
  
  // Focus behavior - add a method to focus the editor
  const focus = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.focus();
    }
  };
  
  return (
    <div className={`wysiwyg-text-area ${className} ${theme === 'dark' ? 'quill-dark' : ''}`}>
      <style jsx global>{`
        .wysiwyg-text-area .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        
        .wysiwyg-text-area .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: ${theme === 'dark' ? '#2a303c' : '#f8f8f8'};
        }
        
        .wysiwyg-text-area.quill-dark .ql-toolbar {
          border-color: #4b5563;
        }
        
        .wysiwyg-text-area.quill-dark .ql-container {
          border-color: #4b5563;
        }
        
        .wysiwyg-text-area.quill-dark .ql-editor {
          color: #e5e7eb;
          background: #1f2937;
        }
        
        .wysiwyg-text-area.quill-dark .ql-snow .ql-stroke {
          stroke: #e5e7eb;
        }
        
        .wysiwyg-text-area.quill-dark .ql-snow .ql-fill {
          fill: #e5e7eb;
        }
        
        .wysiwyg-text-area.quill-dark .ql-picker {
          color: #e5e7eb;
        }
        
        .wysiwyg-text-area .ql-editor {
          padding: 12px 15px;
          min-height: ${minHeight - 42}px; /* Account for toolbar height */
          ${maxHeight > 0 ? `max-height: ${maxHeight - 42}px;` : ''}
          overflow-y: auto;
        }
        
        /* Custom scrollbar styling */
        .wysiwyg-text-area .ql-editor::-webkit-scrollbar {
          width: 8px;
        }
        
        .wysiwyg-text-area .ql-editor::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#374151' : '#f1f1f1'};
          border-radius: 10px;
        }
        
        .wysiwyg-text-area .ql-editor::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#6B7280' : '#c1c1c1'};
          border-radius: 10px;
        }
        
        .wysiwyg-text-area .ql-editor::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#9CA3AF' : '#a8a8a8'};
        }
        
        /* Additional styling for image handling */
        .wysiwyg-text-area .ql-editor img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        placeholder={placeholder}
        readOnly={readOnly}
        style={editorStyle}
      />
    </div>
  );
};

// Add a static method to expose the focus function
WysiwygTextArea.focus = (ref) => {
  if (ref && ref.current) {
    const editor = ref.current.getEditor();
    editor.focus();
  }
};

export default WysiwygTextArea;