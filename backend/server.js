const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Mintmark backend is running' });
});

// Environment info endpoint
app.get('/api/config', (req, res) => {
  res.json({
    network: process.env.APTOS_NETWORK,
    nodeUrl: process.env.APTOS_NODE_URL,
    contractAddress: process.env.CONTRACT_ADDRESS,
    moduleName: process.env.MODULE_NAME
  });
});

// Deploy contract endpoint (protected, only for development)
app.post('/api/deploy', (req, res) => {
  const network = process.env.APTOS_NETWORK || 'devnet';
  
  if (process.env.NODE_ENV === 'production' && network !== 'devnet') {
    return res.status(403).json({ error: 'Deployment is disabled in production for non-devnet environments' });
  }
  
  exec(`npm run deploy:${network}`, { cwd: path.join(__dirname) }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Deployment error: ${error.message}`);
      return res.status(500).json({ error: error.message, stderr });
    }
    res.json({ success: true, message: 'Contract deployed successfully', output: stdout });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mintmark backend server running on port ${PORT}`);
});