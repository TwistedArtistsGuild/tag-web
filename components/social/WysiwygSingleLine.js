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
 * WysiwygSingleLine - A single line rich text editor component
 * Perfect for short rich text inputs like titles, comments, etc.
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
 */
const WysiwygSingleLine = ({
  value = "",
  onChange = () => {},
  placeholder = "Write something...",
  style = {},
  className = "",
  readOnly = false,
  toolbar = null,
  theme = "light",
}) => {
  const quillRef = useRef(null);
  const [editorValue, setEditorValue] = useState(value);
  
  // Default toolbar options for single line editor - limited functionality
  const defaultToolbar = [
    ['bold', 'italic', 'underline', 'link'],
    ['clean'] // remove formatting
  ];
  
  // Use custom toolbar if provided, otherwise use default
  const toolbarOptions = toolbar || defaultToolbar;
  
  // Apply dark theme if specified
  useEffect(() => {
    const editor = document.querySelector('.wysiwyg-single-line');
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
    keyboard: {
      bindings: {
        // Prevent Enter key from creating new lines
        enter: {
          key: 13,
          handler: () => {
            // You could trigger a form submission here
            return false;
          }
        },
        // Allow shift+enter to create a newline if absolutely necessary
        'shift+enter': {
          key: 13,
          shiftKey: true,
          handler: function() {
            return true;
          }
        },
      }
    }
  };
  
  // Handle editor content changes
  const handleChange = (content) => {
    setEditorValue(content);
    onChange(content);
  };
  
  // Apply additional styling for single line behavior
  const editorStyle = {
    maxHeight: '42px',
    overflowY: 'hidden',
    ...style
  };
  
  // Force Quill to be a single line by removing line breaks
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      
      // This event listener will remove any line break automatically
      quill.on('text-change', function(delta, oldDelta, source) {
        if (source === 'user') {
          const text = quill.getText();
          if (text.includes('\n')) {
            const cleanText = text.replace(/\n/g, ' ');
            quill.setText(cleanText);
            
            // Move cursor to end - important for UX
            quill.setSelection(cleanText.length, 0);
          }
        }
      });
    }
  }, [quillRef]);
  
  return (
    <div className={`wysiwyg-single-line ${className} ${theme === 'dark' ? 'quill-dark' : ''}`}>
      <style jsx global>{`
        .wysiwyg-single-line .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        
        .wysiwyg-single-line .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: ${theme === 'dark' ? '#2a303c' : '#f8f8f8'};
        }
        
        .wysiwyg-single-line.quill-dark .ql-toolbar {
          border-color: #4b5563;
        }
        
        .wysiwyg-single-line.quill-dark .ql-container {
          border-color: #4b5563;
        }
        
        .wysiwyg-single-line.quill-dark .ql-editor {
          color: #e5e7eb;
          background: #1f2937;
        }
        
        .wysiwyg-single-line .ql-editor {
          padding: 8px 12px;
          max-height: 42px;
          min-height: 42px;
          overflow-y: hidden;
        }
        
        /* Hide scrollbar but allow scrolling if needed */
        .wysiwyg-single-line .ql-editor::-webkit-scrollbar {
          display: none;
        }
        
        .wysiwyg-single-line .ql-editor {
          scrollbar-width: none;
          -ms-overflow-style: none;
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

export default WysiwygSingleLine;