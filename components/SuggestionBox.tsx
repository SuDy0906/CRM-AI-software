import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { getAISuggestions } from '../lib/suggestion'; // Your Gemini-based function

interface LeadDetails {
  name: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  status: string;
  priority: string;
  source?: string;
  lastContact: string;
  notes?: string;
  conversation?: { message: string; timestamp: Date }[];
}

interface SuggestionBoxProps {
  isOpen: boolean;
  onClose: () => void;
  leadDetails: LeadDetails;
}

export default function SuggestionBox({ isOpen, onClose, leadDetails }: SuggestionBoxProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const result = await getAISuggestions(leadDetails);
        setSuggestions(result);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions(['Error generating suggestions. Try again later.']);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen, leadDetails]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  AI Suggestions
                </Dialog.Title>
                <div className="mt-4 min-h-[100px]">
                  {loading ? (
                    <p className="text-gray-500">Generating suggestions...</p>
                  ) : (
                    <ul className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                          onClick={() => {
                            // Handle suggestion click
                            onClose();
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-4 text-right">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
