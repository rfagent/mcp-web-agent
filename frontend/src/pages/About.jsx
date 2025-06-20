import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000';

const customStyles = `
  .mcp-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #333;
  }
  
  .mcp-card {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
  }
  
  .mcp-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e9ecef;
  }
  
  .mcp-title {
    font-size: 3em;
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  .mcp-subtitle {
    color: #666;
    font-size: 1.1em;
  }
  
  .mcp-section {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 15px;
    margin-bottom: 20px;
    border: 2px solid #e9ecef;
  }
  
  .mcp-section-title {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.5em;
    font-weight: 600;
  }
  
  .mcp-textarea {
    width: 100%;
    padding: 15px;
    border: 2px solid #dee2e6;
    border-radius: 10px;
    font-size: 16px;
    resize: vertical;
    min-height: 80px;
    margin-bottom: 15px;
    font-family: inherit;
  }
  
  .mcp-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .mcp-run-button {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .mcp-run-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  .mcp-run-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  .mcp-quick-tasks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
    margin-top: 20px;
  }
  
  .mcp-task-button {
    background: #fff;
    border: 2px solid #e9ecef;
    padding: 12px 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    font-size: 14px;
  }
  
  .mcp-task-button:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
  
  .mcp-results-success {
    color: #28a745;
  }
  
  .mcp-results-error {
    color: #dc3545;
  }
  
  .mcp-info-box {
    background: #e8f5e8;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #4caf50;
  }
  
  .mcp-error-box {
    background: #ffe8e8;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #f44336;
  }
  
  .mcp-output {
    background: #2c3e50;
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    white-space: pre-wrap;
    max-height: 400px;
    overflow-y: auto;
    font-family: 'Courier New', monospace;
    line-height: 1.4;
  }
  
  .mcp-file-item {
    background: #fff;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 15px;
    transition: all 0.3s ease;
    margin-bottom: 10px;
  }
  
  .mcp-file-item:hover {
    border-color: #667eea;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .mcp-file-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1em;
  }
  
  .mcp-file-info {
    color: #666;
    font-size: 0.9em;
    margin-top: 5px;
  }
  
  .mcp-footer {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #e9ecef;
    color: #666;
  }
  
  .mcp-spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .mcp-card {
      margin: 10px;
      padding: 15px;
    }
    
    .mcp-title {
      font-size: 2em;
    }
    
    .mcp-quick-tasks {
      grid-template-columns: 1fr;
    }
  }
`;

export default function About() {
  const [taskInput, setTaskInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [serverStatus, setServerStatus] = useState('🔴 Disconnected');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/status`);
      if (response.ok) {
        setServerStatus('🟢 Connected');
      } else {
        setServerStatus('🟡 Warning');
      }
    } catch (error) {
      setServerStatus('🔴 Disconnected');
    }
  };

  const setTask = (task) => {
    setTaskInput(task);
  };

  const runAgent = async () => {
    if (isRunning || !taskInput.trim()) {
      if (!taskInput.trim()) {
        alert('Please enter a task for the agent to perform.');
      }
      return;
    }

    setIsRunning(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/agent/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskInput })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setResults(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      runAgent();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="mcp-container">
        <div className="mcp-card">
          
          {/* Header */}
          <header className="mcp-header">
            <h1 className="mcp-title">
              🤖 MCP Web Agent
            </h1>
            <p className="mcp-subtitle">
              Model Context Protocol Agent with Web Interface
            </p>
          </header>

          <main>
            {/* Agent Section */}
            <div className="mcp-section">
              <h2 className="mcp-section-title">
                🎯 Agent Task
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <textarea
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your task here... (e.g., 'Find a great recipe for Banoffee Pie, then summarize it in markdown to banoffee.md')"
                  rows="3"
                  className="mcp-textarea"
                />
                
                <button
                  onClick={runAgent}
                  disabled={isRunning}
                  className="mcp-run-button"
                >
                  {isRunning ? (
                    <>
                      <div className="mcp-spinner"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      🚀 Run Agent
                    </>
                  )}
                </button>
              </div>

              {/* Quick Tasks */}
              <div>
                <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontWeight: '600' }}>
                  📋 Quick Tasks
                </h3>
                <div className="mcp-quick-tasks">
                  <button
                    onClick={() => setTask('Find a great recipe for Banoffee Pie, then summarize it in markdown to banoffee.md')}
                    className="mcp-task-button"
                  >
                    🍰 Find Recipe
                  </button>
                  <button
                    onClick={() => setTask('Research the latest news about AI developments and create a summary report')}
                    className="mcp-task-button"
                  >
                    📰 AI News Summary
                  </button>
                  <button
                    onClick={() => setTask('Find information about Python web frameworks and compare them in a markdown file')}
                    className="mcp-task-button"
                  >
                    🐍 Python Frameworks
                  </button>
                  <button
                    onClick={() => setTask('Search for the best practices for MCP servers and document them')}
                    className="mcp-task-button"
                  >
                    🔧 MCP Best Practices
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div className="mcp-section">
                <h2 className="mcp-section-title mcp-results-success">
                  📊 Results
                </h2>

                <div className="mcp-info-box">
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Task:</strong> <span>{results.task}</span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Status:</strong> <span>✅ Completed Successfully</span>
                  </div>
                  <div>
                    <strong>Completed:</strong> <span>{new Date(results.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontWeight: '600' }}>
                    📝 Agent Output
                  </h3>
                  <pre className="mcp-output">
                    {results.output || 'Agent completed successfully.'}
                  </pre>
                </div>

                {/* Files Section */}
                {results.files && results.files.length > 0 && (
                  <div>
                    <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontWeight: '600' }}>
                      📁 Generated Files
                    </h3>
                    <div>
                      {results.files.map((file, index) => (
                        <div key={index} className="mcp-file-item">
                          <a
                            href={`${API_BASE}${file.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={file.name}
                            className="mcp-file-link"
                          >
                            📄 {file.name}
                          </a>
                          <div className="mcp-file-info">
                            Size: {formatFileSize(file.size)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Section */}
            {error && (
              <div className="mcp-section">
                <h2 className="mcp-section-title mcp-results-error">
                  ❌ Error
                </h2>
                <div className="mcp-error-box">
                  <p style={{ marginBottom: '10px' }}>Failed to execute task: {error}</p>
                  <details style={{ cursor: 'pointer' }}>
                    <summary style={{ color: '#666', marginTop: '10px' }}>Technical Details</summary>
                    <pre className="mcp-output" style={{ marginTop: '10px', maxHeight: '300px' }}>
                      Task: {taskInput}
                      Error: {error}
                      Timestamp: {new Date().toISOString()}
                    </pre>
                  </details>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="mcp-footer">
            <p>Powered by OpenAI Agents SDK + Model Context Protocol</p>
            <div style={{ marginTop: '10px' }}>
              <span>{serverStatus}</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}