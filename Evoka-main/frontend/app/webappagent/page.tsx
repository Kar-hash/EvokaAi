"use client";

import React, { useState, useCallback, useEffect } from "react";
import ChatBox from "@/components/ChatBox";
import Browser from "@/components/Browser";
import Terminal from "@/components/Terminal";
import SiteStructure from "@/components/SiteStructure";
import AppLayout from "@/components/AppLayout";
import { apiService } from "@/services/api";

/**
 * Represents the Web Application Developer Agent page in Evoka AI.
 * Allows users to interact with an AI agent for creating and managing web pages.
 */
export default function WebAppAgentPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentHtml, setCurrentHtml] = useState("");
  const [terminalMessages, setTerminalMessages] = useState([]);
  const [pages, setPages] = useState([
    {
      name: "Home",
      path: "/index.html",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cyber Dark Theme Placeholder</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset and basic styles */
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Consolas", monospace; }
    html, body { width: 100%; height: 100%; background: #0d0d0d; overflow: hidden; }
    body {
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(120deg, #0d0d0d, #181818, #111111, #0d0d0d);
      background-size: 300% 300%;
      animation: cyberGradient 15s ease-in-out infinite;
    }
    @keyframes cyberGradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .container { text-align: center; max-width: 600px; width: 90%; }
    h1 {
      color: #00f4f4; font-size: 3rem; margin-bottom: 1rem; text-transform: uppercase;
      letter-spacing: 0.15em;
      text-shadow: 0 0 5px #00f4f4, 0 0 10px #00ffff66, 0 0 20px #00ffff44;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Create your masterpiece...</h1>
  </div>
</body>
</html>`,
      isActive: true,
    },
  ]);
  const [currentPage, setCurrentPage] = useState("/index.html");

  useEffect(() => {
    const indexPage = pages.find((p) => p.path === "/index.html");
    if (indexPage) {
      setCurrentHtml(indexPage.html);
    }
  }, []);

  const handlePageSelect = (path) => {
    const normalizedPath = path.startsWith("/") ? path : "/" + path;
    const targetPage = pages.find((p) => p.path === normalizedPath);

    if (targetPage) {
      setPages((prev) =>
        prev.map((p) => ({ ...p, isActive: p.path === normalizedPath }))
      );
      setCurrentPage(normalizedPath);
      setCurrentHtml(targetPage.html);

      setTerminalMessages((prev) => [
        ...prev,
        { agentName: "System", content: `Switched to page: ${normalizedPath}`, timestamp: new Date() },
      ]);
    }
  };

  const handleSendMessage = useCallback(
    async (content) => {
      try {
        setIsLoading(true);

        // Add user message
        const userMessage = { role: "user", content, agentName: "User", timestamp: new Date() };
        setMessages((prev) => [...prev, userMessage]);

        const recentMessages = [...messages.slice(-4), userMessage];

        // Call API
        const response = await apiService.sendChatMessage(content, recentMessages, pages);

        // Add AI response
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.response, agentName: "WebAppAgent", timestamp: new Date() },
        ]);

        // Handle changes
        if (response.changes?.length) {
          let updatedPages = [...pages];
          for (const change of response.changes) {
            if (change.action === "create") {
              updatedPages.push({
                name: change.name,
                path: change.path,
                html: change.html,
                isActive: true,
              });
            } else if (change.action === "update") {
              updatedPages = updatedPages.map((p) =>
                p.path === change.path ? { ...p, html: change.html, isActive: true } : p
              );
            } else if (change.action === "delete") {
              updatedPages = updatedPages.filter((p) => p.path !== change.path);
            }
          }
          setPages(updatedPages);
        }
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error processing your request. Please try again.", agentName: "WebAppAgent", timestamp: new Date() },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, pages]
  );

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-[40%] h-full flex flex-col p-2 gap-2">
          <ChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            connectionStatus="Agent Dave"
          />
          <SiteStructure
            pages={pages}
            currentPage={currentPage}
            onPageSelect={handlePageSelect}
          />
        </div>

        <div className="w-[60%] h-full flex flex-col p-2 gap-2">
          <Browser html={currentHtml} pages={pages} isPreviewMode={false} agentType="webapp" />
          <Terminal messages={terminalMessages} isSimulating={false} />
        </div>
      </div>
    </AppLayout>
  );
}
