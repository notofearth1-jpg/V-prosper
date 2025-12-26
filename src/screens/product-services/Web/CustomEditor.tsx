import React, { FC, useState, useEffect } from "react";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";

interface ICustomEditorProps {
  defaultValue?: string;
  serviceDesc?: string;
  containerClassName?: string;
}

const CustomEditor: FC<ICustomEditorProps> = ({
  defaultValue,
  serviceDesc,
  containerClassName,
}) => {
  const [editorState, setEditorState] = useState<EditorState>(() => {
    const initialValue = defaultValue || "";
    const blocksFromHtml = htmlToDraft(initialValue);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  });

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
  };

  useEffect(() => {
    if (defaultValue) {
      const blocksFromHtml = htmlToDraft(defaultValue);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [defaultValue]);

  return (
    <>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        toolbar={{
          options: ["inline", "list", "link"],
          inline: {
            options: ["bold", "italic", "underline"],
          },
        }}
      />
      {serviceDesc && (
        <p
          className={`comman-grey w-full flex-wrap ${containerClassName}`}
          dangerouslySetInnerHTML={{ __html: serviceDesc }}
        />
      )}
    </>
  );
};

export default CustomEditor;
