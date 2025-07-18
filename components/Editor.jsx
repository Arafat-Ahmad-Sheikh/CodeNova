import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import ACTIONS from "../src/action";

const languageOptions = {
  javascript: "js",
  python: "py",
  cpp: "cpp",
  java: "java",
  html: "html",
  typescript: "ts",
};

const Editor = ({ socketRef, roomId }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [nextTabId, setNextTabId] = useState(2);

  // Initialize with default tab if empty
  useEffect(() => {
    if (tabs.length === 0 && socketRef.current) {
      const defaultTab = {
        id: 1,
        name: "file1.js",
        code: "// Start coding",
        language: "javascript"
      };
      setTabs([defaultTab]);
      setActiveTabId(1);
      setNextTabId(2);
    }
  }, [tabs.length, socketRef]);

  // Socket event handlers
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    const handleSyncTabs = ({ tabs }) => {
      if (tabs && tabs.length > 0) {
        setTabs(tabs);
        if (!tabs.some(tab => tab.id === activeTabId)) {
          setActiveTabId(tabs[0].id);
        }
        setNextTabId(Math.max(...tabs.map(tab => tab.id)) + 1);
      }
    };

    const handleCodeChange = ({ tabId, code }) => {
      setTabs(prev => prev.map(tab => 
        tab.id === tabId ? { ...tab, code } : tab
      ));
    };

    const handleAddTab = ({ tab }) => {
      setTabs(prev => [...prev, tab]);
      setNextTabId(prev => Math.max(prev, tab.id + 1));
    };

    const handleDeleteTab = ({ tabId }) => {
      setTabs(prev => {
        const newTabs = prev.filter(tab => tab.id !== tabId);
        if (activeTabId === tabId && newTabs.length > 0) {
          setActiveTabId(newTabs[0].id);
        }
        return newTabs;
      });
    };

    socket.on(ACTIONS.SYNC_TABS, handleSyncTabs);
    socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);
    socket.on(ACTIONS.ADD_TAB, handleAddTab);
    socket.on(ACTIONS.DELETE_TAB, handleDeleteTab);

    return () => {
      socket.off(ACTIONS.SYNC_TABS, handleSyncTabs);
      socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      socket.off(ACTIONS.ADD_TAB, handleAddTab);
      socket.off(ACTIONS.DELETE_TAB, handleDeleteTab);
    };
  }, [socketRef, activeTabId]);

  const handleEditorChange = (value, tabId) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, code: value || "" } : tab
    ));
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, { 
      roomId, 
      tabId, 
      code: value 
    });
  };

  const handleLanguageChange = (tabId, newLang) => {
    const baseName = tabs.find(tab => tab.id === tabId)?.name.split(".")[0];
    const extension = languageOptions[newLang];
    const newName = `${baseName}.${extension}`;

    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, language: newLang, name: newName } : tab
    ));
  };

  const addNewTab = () => {
    const defaultLang = "javascript";
    const extension = languageOptions[defaultLang];
    const newTab = {
      id: nextTabId,
      name: `file${nextTabId}.${extension}`,
      code: "// New file\n",
      language: defaultLang,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setNextTabId(nextTabId + 1);
    socketRef.current?.emit(ACTIONS.ADD_TAB, { roomId, tab: newTab });
  };

  const deleteTab = (tabId) => {
    if (tabs.length <= 1) {
      // Don't allow deleting the last tab
      return;
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTabId === tabId) {
      setActiveTabId(tabs.find(tab => tab.id !== tabId)?.id);
    }
    socketRef.current?.emit(ACTIONS.DELETE_TAB, { roomId, tabId });
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-[calc(100vh-120px-1rem)]">
      <div className="flex border-b border-base-300 bg-base-200">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab cursor-pointer px-4 py-2 border-r ${
              tab.id === activeTabId ? "tab-active font-bold bg-white" : "bg-base-200"
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span>{tab.name}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTab(tab.id);
                }}
                className="ml-2 text-red-500 hover:text-red-700 font-bold"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addNewTab}
          className="btn btn-sm btn-outline btn-accent ml-auto mr-2 my-1"
        >
          + Add Tab
        </button>
      </div>

      <div className="flex-1 bg-base-100 p-4 overflow-hidden">
        {activeTab && (
          <div className="h-full flex flex-col gap-2">
            <div className="mb-2">
              <label className="mr-2 font-medium">Language:</label>
              <select
                className="select select-bordered select-sm"
                value={activeTab.language}
                onChange={(e) => handleLanguageChange(activeTab.id, e.target.value)}
              >
                {Object.keys(languageOptions).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <MonacoEditor
              height="100%"
              language={activeTab.language}
              value={activeTab.code}
              onChange={(val) => handleEditorChange(val, activeTab.id)}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
