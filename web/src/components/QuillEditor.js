import React, { useMemo, memo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';

import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageResize', ImageResize);

const QuillEditor = memo(({ quillRef, htmlContent, setHtmlContent }) => {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          [{ align: [] }, { color: [] }, { background: [] }],
          ['link', 'image', 'video'],
          // ['clean'],
        ],
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    }),
    []
  );

  return (
    <>
      <ReactQuill
        modules={modules}
        ref={quillRef}
        value={htmlContent}
        onChange={setHtmlContent}
        theme="snow"
      />
    </>
  );
});

export default QuillEditor;
