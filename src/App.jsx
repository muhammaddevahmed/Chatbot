import { Box } from '@mui/material'
import AIChatbot from './components/AIChatbot'
import './index.css'

function App() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f7fa"
      p={2}
    >
      <AIChatbot />
    </Box>
  )
}

export default App