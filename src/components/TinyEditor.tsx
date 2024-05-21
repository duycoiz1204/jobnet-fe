import envConfig from '@/config';
import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect } from 'react';

type Type = {
  data: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function TinyEditor({ data, ...props }: Type) {
  const tiny_mce_api_key = envConfig.TINYMCE_KEY;

  const [value, setValue] = useState<string>(data || '');
  useEffect(() => {
    setValue(data);
  }, [data]);

  const tinymceSetting = {
    height: 500,
    menubar: false,
    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'code',
      'help',
      'wordcount',
    ],
    toolbar:
      'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style:
      'body { font-family: Helvetica,Arial,sans-serif; font-size:14px }',
  };

  return (
    <>
      <Editor
        apiKey={tiny_mce_api_key}
        initialValue={value}
        init={tinymceSetting}
        onInit={(_evt, editor) => {
          editor.on('change', () => {
            setValue(editor.getContent());
          });
        }}
      />
      <input type="hidden" value={value} {...props} />
    </>
  );
}

export default TinyEditor;
