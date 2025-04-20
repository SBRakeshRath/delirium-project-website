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
          <div className="background">
            {/* video full */}
            <video autoPlay loop muted className="backgroundVideo">
              <source src="/videoplayback (3).mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <Editor
            height="100%"
            defaultValue={`println "I Surrender!";`}
            theme="vs-dark"
            language="plaintext"
            options={{
              padding: { top: 20, bottom: 20 },
              fontSize: 16,
              minimap: { enabled: false },
            }}
            onMount={(editor, monaco) => {
              editorRef.current = editor;
              monaco.editor.defineTheme("vs-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [],
                colors: {
                  "editor.background": "#00000080",
                },
              });
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
            <pre className="output-text">{response}</pre>
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
