import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { LuSend, LuX, LuMessageCircle, LuBot, LuUser, LuMaximize2, LuMinimize2, LuUsers } from "react-icons/lu";

// Message limit configuration
const MAX_MESSAGES = 15; // Stop at 15 messages and suggest contact
const SOFT_LIMIT = 10; // Start hinting at contact after 10 messages

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showTeamButton, setShowTeamButton] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize with welcome message and service buttons when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initializeChat = async () => {
        try {
          const response = await fetch("https://chatbot-4l4b.onrender.com/services");
          const data = await response.json();
          
          setMessages([
            {
              role: "assistant",
              content:
                "Hello! 👋 I'm Devly's AI assistant. I'm here to help you bring your digital vision to life!\n\nWhat would you like to build today?",
              services: data.services || null,
            },
          ]);
        } catch (error) {
          console.error("Error fetching services:", error);
          setMessages([
            {
              role: "assistant",
              content:
                "Hello! 👋 I'm Devly's AI assistant. What type of project are you looking to build?",
            },
          ]);
        }
      };

      setTimeout(initializeChat, 500);
    }
  }, [isOpen]);

  // Handle service button click
  const handleServiceClick = async (service) => {
    setSelectedService(service);
    
    const userMessage = `I want to build: ${service.title}`;
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("https://chatbot-4l4b.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(0, -1).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          selectedService: service.title,
        }),
      });

      const data = await response.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply },
      ]);
      
      // Check if we should show team button
      if (data.showTeamButton) {
        setShowTeamButton(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Great choice! Tell me more about what features you need for your project.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "Meet the Team" button click
  const handleMeetTeamClick = async () => {
    const userMessage = "Tell me about the Devly team";
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("https://chatbot-4l4b.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "We're a passionate team of developers, designers, and digital strategists based in Algeria, dedicated to creating exceptional digital experiences!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const messageCount = messages.filter(m => m.role === 'user').length;

    // Hard limit - prevent sending after MAX_MESSAGES
    if (messageCount >= MAX_MESSAGES) {
      setMessages([
        ...messages,
        {
          role: "assistant",
          content: "I'd love to continue helping you, but to give you the best personalized service, let me connect you with our team! They'll be able to discuss your project in detail and provide an exact quote. Shall I get your contact information? 😊",
        },
      ]);
      setTimeout(() => setShowContactForm(true), 1000);
      return;
    }

    setInput("");

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("https://chatbot-4l4b.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
          selectedService: selectedService?.title || null,
          messageCount: messageCount + 1,
        }),
      });

      const data = await response.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply },
      ]);

      // Check if we should show team button
      if (data.showTeamButton) {
        setShowTeamButton(true);
      }

      // Show contact form logic
      const shouldShowForm = 
        data.metadata?.conversationStage === 'ready_for_contact' &&
        data.metadata?.userAgreed === true &&
        data.metadata?.askedForContactPermission === true &&
        !showContactForm;

      if (shouldShowForm) {
        setTimeout(() => {
          setShowContactForm(true);
        }, 1000);
      }

    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "I apologize, but I'm experiencing technical difficulties. Please try again or contact us directly at contact@devly.dz",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactData.name || !contactData.email || !contactData.phone) {
      alert("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://chatbot-4l4b.onrender.com/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactData,
          conversationSummary: messages,
          selectedService: selectedService?.title || "Not specified",
        }),
      });

      if (response.ok) {
        setMessages([
          ...messages,
          {
            role: "assistant",
            content: `Perfect, ${contactData.name}! 🎉 We've received your information and our team will reach out to you at ${contactData.email} within 24 hours to discuss your project in detail. We're excited to bring your vision to life! Looking forward to working with you! 🚀`,
          },
        ]);
        setShowContactForm(false);
        setContactData({ name: "", email: "", phone: "" });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting contact:", error);
      alert("Sorry, there was an error submitting your information. Please try again or email us directly at contact@devly.dz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseContactForm = () => {
    setShowContactForm(false);
    setMessages([
      ...messages,
      {
        role: "assistant",
        content: "No problem! Feel free to continue asking questions, and let me know when you're ready to connect with our team. I'm here to help! 😊",
      },
    ]);
  };

  // Service Button Component
  const ServiceButton = ({ service, onClick }) => (
    <button
      onClick={() => onClick(service)}
      className="group relative bg-lighter hover:bg-lighter/80 border border-border hover:border-primary text-heading rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-left"
    >
      <div className="flex items-start gap-3">
        {service.iconEmoji && (
          <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
            {service.iconEmoji}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
            {service.title}
          </h4>
          {service.subtitle && (
            <p className="text-sm text-base">
              {service.subtitle}
            </p>
          )}
        </div>
      </div>
    </button>
  );

  // Render chatbot UI
  const chatbotUI = (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-primary text-black rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center group relative"
            aria-label="Open chat"
          >
            <LuMessageCircle className="text-3xl group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={isFullscreen ? "fixed inset-0 z-[9999]" : "fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[9999] left-0 sm:left-auto top-auto"}
        >
          <div className={`bg-black border border-border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
            isFullscreen 
              ? "w-full h-screen rounded-none" 
              : "w-full h-screen sm:w-[420px] sm:h-[650px] sm:rounded-2xl rounded-none"
          }`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary via-primary to-primary/90 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <LuBot className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-black font-bold text-lg sm:text-xl">
                    Devly AI Assistant
                  </h3>
                  <p className="text-black/70 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                    Online • Here to help you
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {showTeamButton && (
                  <button
                    onClick={handleMeetTeamClick}
                    className="text-black hover:bg-black/10 rounded-full p-2 transition-colors flex items-center gap-1 text-xs font-medium"
                    aria-label="Meet the team"
                    title="Meet the Devly team"
                  >
                    <LuUsers className="text-lg" />
                  </button>
                )}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-black hover:bg-black/10 rounded-full p-2 transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <LuMinimize2 className="text-xl" />
                  ) : (
                    <LuMaximize2 className="text-xl" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-black hover:bg-black/10 rounded-full p-2 transition-colors"
                  aria-label="Close chat"
                >
                  <LuX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
              {messages.map((message, index) => (
                <div key={index}>
                  <div
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user"
                            ? "bg-primary shadow-lg shadow-primary/30"
                            : "bg-lighter border border-primary/30"
                        }`}
                      >
                        {message.role === "user" ? (
                          <LuUser className="text-black text-sm" />
                        ) : (
                          <LuBot className="text-primary text-sm" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-black rounded-br-none shadow-lg shadow-primary/20"
                            : "bg-lighter text-heading rounded-bl-none border border-border"
                        }`}
                      >
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Buttons (only for first message with services) */}
                  {message.services && message.role === "assistant" && (
                    <div className="mt-3 grid grid-cols-1 gap-2 animate-slideUp">
                      {message.services.map((service, idx) => (
                        <ServiceButton
                          key={idx}
                          service={service}
                          onClick={handleServiceClick}
                        />
                      ))}
                      <button
                        onClick={() => {
                          setMessages([
                            ...messages,
                            {
                              role: "user",
                              content: "I'd like to tell you about my project directly",
                            },
                          ]);
                          setIsLoading(true);
                          setTimeout(() => {
                            setMessages(prev => [
                              ...prev,
                              {
                                role: "assistant",
                                content: "Perfect! I'd love to hear about your project. What are you looking to build?",
                              },
                            ]);
                            setIsLoading(false);
                          }, 500);
                        }}
                        className="bg-black hover:bg-lighter border border-border hover:border-primary/50 text-base rounded-xl p-3 transition-all duration-300 text-base"
                      >
                        💬 Tell you directly
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-lighter border border-primary/30">
                      <LuBot className="text-primary text-sm" />
                    </div>
                    <div className="bg-lighter text-heading rounded-2xl rounded-bl-none px-4 py-3 border border-border">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Contact Form */}
            {showContactForm && (
              <div className="p-4 bg-lighter border-t border-border animate-slideUp">
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-heading font-semibold text-base">
                      📋 Let's Connect!
                    </h4>
                    <button
                      type="button"
                      onClick={handleCloseContactForm}
                      className="text-base hover:text-heading text-sm transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    value={contactData.name}
                    onChange={(e) =>
                      setContactData({ ...contactData, name: e.target.value })
                    }
                    className="w-full bg-black text-heading border border-border rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary transition-colors placeholder-base"
                    required
                    disabled={isLoading}
                  />
                  
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={contactData.email}
                    onChange={(e) =>
                      setContactData({ ...contactData, email: e.target.value })
                    }
                    className="w-full bg-black text-heading border border-border rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary transition-colors placeholder-base"
                    required
                    disabled={isLoading}
                  />
                  
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={contactData.phone}
                    onChange={(e) =>
                      setContactData({ ...contactData, phone: e.target.value })
                    }
                    className="w-full bg-black text-heading border border-border rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary transition-colors placeholder-base"
                    required
                    disabled={isLoading}
                  />
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-black font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg shadow-primary/20"
                  >
                    {isLoading ? "Submitting..." : "Send & Get Proposal 🚀"}
                  </button>
                  
                  <p className="text-sm text-base text-center">
                    We'll get back to you within 24 hours
                  </p>
                </form>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-black">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-lighter text-heading border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:border-primary transition-colors placeholder-base"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-primary text-black rounded-xl px-4 py-3 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/20"
                  aria-label="Send message"
                >
                  <LuSend className="text-xl" />
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-base text-sm">
                  Powered by Devly AI
                </p>
                {messages.filter(m => m.role === 'user').length >= SOFT_LIMIT && (
                  <p className="text-sm text-primary animate-pulse">
                    {MAX_MESSAGES - messages.filter(m => m.role === 'user').length} messages left
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );

  return createPortal(chatbotUI, document.body);
}