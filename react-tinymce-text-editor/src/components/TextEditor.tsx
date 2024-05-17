import { FunctionComponent, useRef, useState } from "react";

import "tinymce/tinymce";

import "tinymce/icons/default";
import "tinymce/models/dom/model";

import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/table";
import "tinymce/plugins/wordcount";

// Here are some other plugins that might come in handy but are not used in this demo.
// If you need one of these, make sure to add it to the list of plugins defined in the Editor component.

// import "tinymce/plugins/autoresize";
// import "tinymce/plugins/autosave";
// import "tinymce/plugins/charmap";
// import "tinymce/plugins/code";
// import "tinymce/plugins/codesample";
// import "tinymce/plugins/directionality";
// import "tinymce/plugins/emoticons";
// import "tinymce/plugins/fullscreen";
// import "tinymce/plugins/importcss";
// import "tinymce/plugins/insertdatetime";
// import "tinymce/plugins/media";
// import "tinymce/plugins/nonbreaking";
// import "tinymce/plugins/pagebreak";
// import "tinymce/plugins/preview";
// import "tinymce/plugins/quickbars";
// import "tinymce/plugins/save";
// import "tinymce/plugins/visualblocks";
// import "tinymce/plugins/visualchars";

// Editor styles and theme.
import "tinymce/skins/content/default/content.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/themes/silver";

import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

interface TextEditorProps {
  initialValue?: string;
  disabled?: boolean;
}

const TextEditor: FunctionComponent<TextEditorProps> = ({
  initialValue,
  disabled,
}) => {
  // Used for retrieving content from uncontrolled editor.
  const editorRef: React.MutableRefObject<TinyMCEEditor | null> = useRef(null);

  const [editorId, setEditorId] = useState<string>();
  const [content, setContent] = useState<string>();

  // Remove this if you need a controlled component. In that case, the onInit prop and editorRef can be removed as well.
  function handleContentSubmit() {
    if (editorRef.current) {
      // Get editor content from ref.
      const editorContent = editorRef.current.getContent();

      console.log("Content saved: ", editorContent);
      setContent(editorContent);
    }
  }

  // If you need the editor component to be controlled, uncomment this and use the onEditorChange prop. Make sure to debounce it to avoid unnecessary re-rendering.
  // function onEditorContentChange(content: string, editor: TinyMCEEditor) {
  //   console.log("Content changed: ", content);
  //   setContent(content);
  // }

  return (
    <>
      <label
        htmlFor={editorId}
        style={{
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Content
      </label>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        // onEditorChange={onEditorContentChange}
        disabled={disabled}
        init={{
          skin: false, // Use imported skin css.
          content_css: false, // Use imported content css.
          width: 875,
          height: 500,
          menubar: false,
          branding: false,
          license_key: "gpl", // Read about license keys at: https://www.tiny.cloud/docs/tinymce/latest/license-key/
          plugins: [
            "advlist",
            "anchor",
            "autolink",
            "image",
            "link",
            "lists",
            "searchreplace",
            "table",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          help_tabs: [
            "shortcuts", // The default shortcuts tab.
            "keyboardnav", // The default keyboard navigation tab.
          ],
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          init_instance_callback: function (editor) {
            // Set textbox id for accessibility purposes (label htmlFor).
            setEditorId(editor.id);
          },
        }}
      />
      <button onClick={handleContentSubmit} style={{ margin: "16px" }}>
        Save content
      </button>
    </>
  );
};

export default TextEditor;
