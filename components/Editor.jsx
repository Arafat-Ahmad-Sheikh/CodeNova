import React, { useState } from "react";
import { useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import ACTIONS from "../src/action";

// Mapping of language to file extension
const languageOptions = {
  javascript: "js",
  python: "py",
  cpp: "cpp",
  java: "java",
  html: "html",
  typescript: "ts",
};

const Editor = ({ socketRef, roomId }) => {

  const [tabs, setTabs] = useState([
    { id: 1, name: "file1.js", code: "// Code for file1.js\n", language: "javascript" },
  ]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [nextTabId, setNextTabId] = useState(2);

  const handleEditorChange = (value, tabId) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === tabId ? { ...tab, code: value || "" } : tab))
    );

    if (socketRef?.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: value, // send the new code
      });
    }
  };


  useEffect(() => {
    if (!socketRef?.current) return;

    console.log("Setting code change listener");
    const handleRemoteCodeChange = ({ code }) => {
      console.log("Remote code received:", code);
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTabId ? { ...tab, code } : tab
        )
      );
    };

    socketRef.current.on(ACTIONS.CODE_CHANGE, handleRemoteCodeChange);

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE, handleRemoteCodeChange);
    };
  }, [socketRef?.current, activeTabId]);

  const handleLanguageChange = (tabId, newLang) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === tabId) {
          const baseName = tab.name.split(".")[0];
          const newExtension = languageOptions[newLang];
          return {
            ...tab,
            language: newLang,
            name: `${baseName}.${newExtension}`,
          };
        }
        return tab;
      })
    );
  };

  const addNewTab = () => {
    const defaultLang = "javascript";
    const extension = languageOptions[defaultLang];
    const newId = nextTabId;
    setTabs((prevTabs) => [
      ...prevTabs,
      {
        id: newId,
        name: `file${newId}.${extension}`,
        code: "// New file\n",
        language: defaultLang,
      },
    ]);
    setActiveTabId(newId);
    setNextTabId(newId + 1);
  };

  const deleteTab = (tabId) => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((tab) => tab.id !== tabId);
      if (newTabs.length === 0) {
        const defaultLang = "javascript";
        const extension = languageOptions[defaultLang];
        return [
          {
            id: 1,
            name: `file1.${extension}`,
            code: "",
            language: defaultLang,
          },
        ];
      }
      if (activeTabId === tabId) {
        setActiveTabId(newTabs[0].id);
      }
      return newTabs;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px-1rem)]">
      {/* Tabs Header */}
      <div className="flex border-b border-base-300 bg-base-200">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab cursor-pointer px-4 py-2 border-r border-base-300 flex items-center ${tab.id === activeTabId ? "tab-active font-bold bg-white" : "bg-base-200"
              }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span>{tab.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTab(tab.id);
              }}
              className="ml-2 text-red-500 hover:text-red-700 font-bold"
              title="Delete tab"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          onClick={addNewTab}
          className="btn btn-sm btn-outline btn-accent ml-auto mr-2 my-1"
          type="button"
        >
          + Add Tab
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-base-100 p-4 overflow-hidden">
        {tabs.map(
          (tab) =>
            tab.id === activeTabId && (
              <div key={tab.id} className="h-full flex flex-col gap-2">
                {/* Language Selector */}
                <div className="mb-2">
                  <label className="mr-2 font-medium">Language:</label>
                  <select
                    className="select select-bordered select-sm"
                    value={tab.language}
                    onChange={(e) => handleLanguageChange(tab.id, e.target.value)}
                  >
                    {Object.keys(languageOptions).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Monaco Editor */}
                <MonacoEditor
                  key={activeTabId}
                  height="100%"
                  language={tab.language}
                  value={tab.code}
                  onChange={(value) => handleEditorChange(value, tab.id)}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    wordWrap: "on",
                    automaticLayout: true,
                  }}
                />
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Editor;
