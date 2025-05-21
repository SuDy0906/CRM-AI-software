import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ConversationLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
}

// Updated ConversationEntry interface (id removed)
interface ConversationEntry {
  message: string;
  timestamp: string;
}

export const ConversationLogModal: React.FC<ConversationLogModalProps> = ({
  isOpen,
  onClose,
  leadId,
}) => {
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  },);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      const data = await response.json();
      setConversations(data.conversation || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleLogConversation = async () => {
    if (!newMessage.trim()) return;

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: [
            ...conversations,
            {
              message: newMessage,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      await fetchConversations();
      setNewMessage('');
    } catch (error) {
      console.error('Error logging conversation:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-xl w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-medium">
              Conversation Log
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col space-y-4 h-[400px]">
              <div className="flex-1 overflow-y-auto border rounded-md p-4">
                {conversations.map((conv, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-md mb-2"
                  >
                    <p className="text-xs text-gray-500">
                      {new Date(conv.timestamp).toLocaleString()}
                    </p>
                    <p className="mt-1">{conv.message}</p>
                  </div>
                ))}
              </div>

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full border rounded-md p-2"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleLogConversation}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Log Conversation
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
