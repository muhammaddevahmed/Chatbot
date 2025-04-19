import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box, TextField, IconButton, Avatar, Typography } from '@mui/material'
import { Send, SmartToy, Person } from '@mui/icons-material'

// Styled components
const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '500px',
  height: '600px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f3e8ff 100%)', /* Soft gradient */
  borderRadius: '20px',
  boxShadow: '0 12px 40px rgba(124, 58, 237, 0.2)', /* Vibrant purple shadow */
  overflow: 'hidden',
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)', /* Subtle lift on hover */
  },
})

const ChatHeader = styled(Box)({
  padding: '16px',
  background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', /* Colorful gradient */
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', /* Depth */
})

const MessagesContainer = styled(Box)({
  flex: 1,
  padding: '16px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  background: 'rgba(255, 255, 255, 0.8)', /* Semi-transparent for layering */
  borderRadius: '16px 16px 0 0',
})

const MessageBubble = styled(Box)(({ sender }) => ({
  maxWidth: '80%',
  padding: '12px 16px',
  borderRadius: sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  background: sender === 'user' 
    ? 'linear-gradient(45deg, #7c3aed, #db2777)' /* User: Vibrant gradient */
    : 'linear-gradient(45deg, #e0e7ff, #f3e8ff)', /* AI: Soft gradient */
  color: sender === 'user' ? 'white' : '#1f2937',
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  wordBreak: 'break-word',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)', /* Slight scale on hover */
    boxShadow: '0 6px 16px rgba(124, 58, 237, 0.3)',
  },
}))

const InputContainer = styled(Box)({
  padding: '16px',
  borderTop: '1px solid rgba(124, 58, 237, 0.2)', /* Purple tint */
  display: 'flex',
  gap: '8px',
  background: 'rgba(255, 255, 255, 0.9)', /* Semi-transparent */
})

const TypingIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 16px',
  background: 'linear-gradient(45deg, #e0e7ff, #f3e8ff)', /* Soft gradient */
  borderRadius: '18px',
  alignSelf: 'flex-start',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
})

const Dot = styled(Box)({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#7c3aed', /* Vibrant purple */
})

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am your AI assistant. How can I help you today?",
      sender: 'ai',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.href,
          "X-Title": "Vite AI Chatbot",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1:free",
          "messages": [
            {
              "role": "user",
              "content": input
            }
          ]
        })
      })

      const data = await response.json()
      const aiMessage = {
        id: messages.length + 2,
        text: data.choices[0].message.content,
        sender: 'ai',
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error calling OpenRouter:', error)
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <Avatar sx={{ bgcolor: 'white', color: '#7c3aed', transform: 'scale(1.1)' }}>
          <SmartToy />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
          Ahmed AI Assistant
        </Typography>
      </ChatHeader>

      <MessagesContainer>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box display="flex" alignItems="center" gap="8px">
                {message.sender === 'ai' && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#e0e7ff' }}>
                    <SmartToy fontSize="small" sx={{ color: '#7c3aed' }} />
                  </Avatar>
                )}
                <MessageBubble sender={message.sender}>
                  {message.text}
                </MessageBubble>
                {message.sender === 'user' && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#7c3aed' }}>
                    <Person fontSize="small" sx={{ color: 'white' }} />
                  </Avatar>
                )}
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <TypingIndicator>
              <Dot
                as={motion.div}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
              />
              <Dot
                as={motion.div}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
              />
              <Dot
                as={motion.div}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
              />
              <Typography variant="caption" sx={{ color: '#7c3aed' }}>
                AI is typing...
              </Typography>
            </TypingIndicator>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #f5f7fa, #e0e7ff)', /* Soft gradient */
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)', /* Glow on hover */
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)', /* Stronger glow */
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(124, 58, 237, 0.3)',
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!input.trim()}
          sx={{
            background: 'linear-gradient(45deg, #7c3aed, #db2777)', /* Vibrant gradient */
            color: 'white',
            padding: '12px',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              background: 'linear-gradient(45deg, #5b21b6, #be185d)', /* Darker gradient */
              boxShadow: '0 6px 16px rgba(124, 58, 237, 0.3)',
              transform: 'scale(1.1)', /* Slight scale */
            },
            '&:disabled': {
              background: '#e0e0e0',
              boxShadow: 'none',
              transform: 'scale(1)',
            },
          }}
        >
          <Send />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  )
}