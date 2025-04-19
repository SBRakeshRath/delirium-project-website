import IDE from "@/components/IDE/ide";


export default () => {

  return (
    <div className="codeEditorPage">
      <div className="navContainer"></div>
      <div className="editorContainer">
        <IDE />
      </div>  
    </div>
  );
};
