"use client";

import { Share_Tech_Mono } from "next/font/google";

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
});
import handelCode from "@/serverFunctions/handelCode";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useRef, useState } from "react";
import "./ide.scss";

export default function IDE() {
  const editorRef = useRef<any>(null);
  const [response, setResponse] = useState<string>(
    "Awaiting your command... consequences included."
  );
  const [loading, setLoading] = useState<boolean>(false);
  const handelCodeCallback = async (code: string) => {
    setLoading(true);
    setResponse("Judging your sins...");
    try {
      const res = await handelCode(code);

      if (!res) {
        console.log("Code executed successfully!");
        throw new Error("Code execution failed.");
      }
      setResponse(res);
    } catch (error) {
      console.error("Error executing code:", error);
      setResponse("Error executing code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ideContainer">
      <div className="topActions"></div>
      <div className="editorWrapper">
        <div className="editor">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// some comment"
            theme="vs-dark"
            options={{
              padding: { top: 20, bottom: 20 },
              fontSize: 16,
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>
        <div className="outPut">
          <div className="header">
            <h2 className={`${shareTechMono.className} fate-heading`}>
              Fate Console
            </h2>
          </div>
          <div className="output-container">
            <p className="output-text">{response}</p>
          </div>

          <div className="actionButtons">
            <button
              className="run-code-btn"
              onClick={() => {
                const code = editorRef.current.getValue();
                handelCodeCallback(code);
              }}
            >
              {/* Unleash! */}
              {loading ? "Unleashing..." : "Unleash!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
