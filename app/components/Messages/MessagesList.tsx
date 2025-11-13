"use client";

import MessageItem from "./MessageItem";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Search } from "lucide-react";

export default function MessagesList({
  messages,
  filteredMessages,
  starredMessages,
  unreadCount,
  selectedMessage,
  setSelectedMessage,
  searchQuery,
  setSearchQuery,
  isDark
}: any) {
  return (
    <div
      className={` col-span-1 
    h-[700px]  
    overflow-hidden   
    ${isDark 
      ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
      : "bg-white shadow-lg"
    }
    border
    ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"}
    rounded-xl 
    backdrop-blur-sm`}
    >
      {/* Search */}
      <div
        className={`p-4 border-b ${
          isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
        }`}
      >
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? "text-[#6a7282]" : "text-purple-400"
            }`}
            size={16}
          />

          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 ${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.1)] text-white"
                : "bg-white border-[#ddd6fe] text-[#2e1065]"
            }`}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">

        <TabsList
          className={`w-full bg-transparent border-b ${
            isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
          } rounded-none p-0`}
        >
          <TabsTrigger
            value="all"
            className={`flex-1 rounded-none border-b-2 border-transparent ${
              isDark
                ? "data-[state=active]:bg-[rgba(94,234,212,0.1)] data-[state=active]:text-teal-300 data-[state=active]:border-teal-300"
                : "data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-600 data-[state=active]:font-semibold"
            }`}
          >
            All
          </TabsTrigger>

          <TabsTrigger
            value="unread"
            className={`flex-1 rounded-none border-b-2 border-transparent ${
              isDark
                ? "data-[state=active]:bg-[rgba(94,234,212,0.1)] data-[state=active]:text-teal-300 data-[state=active]:border-teal-300"
                : "data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-600 data-[state=active]:font-semibold"
            }`}
          >
            Unread ({unreadCount})
          </TabsTrigger>

          <TabsTrigger
            value="starred"
            className={`flex-1 rounded-none border-b-2 border-transparent ${
              isDark
                ? "data-[state=active]:bg-[rgba(94,234,212,0.1)] data-[state=active]:text-teal-300 data-[state=active]:border-teal-300"
                : "data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-600 data-[state=active]:font-semibold"
            }`}
          >
            Starred
          </TabsTrigger>
        </TabsList>

        {/* ALL */}
        <TabsContent value="all" className="mt-0">
          <div className="max-h-[600px] overflow-y-auto">
            {filteredMessages.map((message: any) => (
              <MessageItem
                key={message.id}
                message={message}
                selectedMessage={selectedMessage}
                isDark={isDark}
                onClick={() => setSelectedMessage(message)}
              />
            ))}
          </div>
        </TabsContent>

        {/* UNREAD */}
        <TabsContent value="unread" className="mt-0">
          <div className="max-h-[600px] overflow-y-auto">
            {filteredMessages
              .filter((m: any) => !m.read)
              .map((message: any) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  selectedMessage={selectedMessage}
                  isDark={isDark}
                  onClick={() => setSelectedMessage(message)}
                />
              ))}
          </div>
        </TabsContent>

        {/* STARRED */}
        <TabsContent value="starred" className="mt-0">
          <div className="max-h-[600px] overflow-y-auto">
            {starredMessages.map((message: any) => (
              <MessageItem
                key={message.id}
                message={message}
                selectedMessage={selectedMessage}
                isDark={isDark}
                onClick={() => setSelectedMessage(message)}
              />
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
