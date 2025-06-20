#!/usr/bin/env python3
"""
Real MCP Agent - Web Interface Compatible
Combines the real MCP capabilities from mcp_lab1.py with web interface compatibility
"""

import os
import sys
import asyncio
import time
from dotenv import load_dotenv

# Try to import MCP dependencies
try:
    from agents import Agent, Runner, trace
    from agents.mcp import MCPServerStdio
    MCP_AVAILABLE = True
    print("✅ OpenAI Agents SDK available - Full MCP mode enabled")
except ImportError:
    MCP_AVAILABLE = False
    print("⚠️ OpenAI Agents SDK not available - Running in fallback mode")

def setup_environment():
    """Load environment variables"""
    load_dotenv(override=True)

async def run_real_mcp_agent(task):
    """Run the REAL MCP agent with web browsing and file system capabilities"""
    
    # Instructions for the agent (from mcp_lab1.py)
    instructions = """
    You browse the internet to accomplish your instructions.
    You are highly capable at browsing the internet independently to accomplish your task, 
    including accepting all cookies and clicking 'not now' as
    appropriate to get to the content you need. If one website isn't fruitful, try another. 
    Be persistent until you have solved your assignment,
    trying different options and sites as needed.
    """
    
    # Set up MCP server parameters (from mcp_lab1.py)
    sandbox_path = os.path.abspath(os.path.join(os.getcwd(), "sandbox"))
    
    # Ensure sandbox directory exists
    if not os.path.exists(sandbox_path):
        print(f"📁 Creating sandbox directory: {sandbox_path}")
        os.makedirs(sandbox_path, mode=0o755)
    
    # File system MCP server
    files_params = {
        "command": "npx", 
        "args": ["-y", "@modelcontextprotocol/server-filesystem", sandbox_path]
    }
    
    # Playwright (browser) MCP server
    playwright_params = {
        "command": "npx",
        "args": ["@playwright/mcp@latest"]
    }
    
    print(f"🤖 Starting REAL MCP Agent for task: {task}")
    print(f"📁 Sandbox path: {sandbox_path}")
    print("🌐 Connecting to MCP servers...")
    
    try:
        # Create and run the agent with MCP servers (from mcp_lab1.py)
        async with MCPServerStdio(params=files_params, client_session_timeout_seconds=30) as mcp_server_files:
            async with MCPServerStdio(params=playwright_params, client_session_timeout_seconds=30) as mcp_server_browser:
                
                print("🔗 Connected to filesystem and browser MCP servers")
                
                # Create the agent
                agent = Agent(
                    name="investigator", 
                    instructions=instructions, 
                    model="gpt-4.1-mini",
                    mcp_servers=[mcp_server_files, mcp_server_browser]
                )
                
                # Run the agent with tracing
                with trace("investigate"):
                    print("🚀 Agent starting execution...")
                    result = await Runner.run(agent, task)
                    
                    print("\n" + "="*60)
                    print("✅ REAL MCP AGENT COMPLETED SUCCESSFULLY")
                    print("="*60)
                    print(result.final_output)
                    print("="*60)
                    
                    return result.final_output
                    
    except Exception as e:
        error_msg = f"❌ Real MCP agent execution failed: {str(e)}"
        print(error_msg)
        raise Exception(error_msg)

def run_fallback_agent(task):
    """Fallback agent when MCP dependencies aren't available"""
    
    print(f"🧪 FALLBACK MODE: Running without full MCP capabilities")
    print(f"📋 Task: {task}")
    
    # Simulate realistic agent work
    steps = [
        "🔍 Analyzing task requirements...",
        "🌐 Simulating web research...", 
        "📊 Processing information...",
        "📝 Generating content...",
        "💾 Saving to file..."
    ]
    
    for i, step in enumerate(steps):
        print(f"Step {i+1}/5: {step}")
        time.sleep(0.8)
    
    # Create sandbox directory
    sandbox_path = os.path.abspath(os.path.join(os.getcwd(), "sandbox"))
    os.makedirs(sandbox_path, exist_ok=True)
    
    # Generate content based on task keywords
    task_lower = task.lower()
    
    if "banoffee" in task_lower or "recipe" in task_lower:
        filename = "banoffee.md"
        content = """# Banoffee Pie Recipe

A delicious British dessert combining bananas, toffee, and cream.

## Ingredients
- **Base**: 200g digestive biscuits, 100g butter (melted)
- **Toffee**: 397g can condensed milk
- **Topping**: 3-4 ripe bananas, 300ml double cream, dark chocolate

## Method

### 1. Prepare the Base
- Crush digestive biscuits into fine crumbs
- Mix with melted butter until combined
- Press firmly into 20cm pie dish
- Chill for 30 minutes

### 2. Make the Toffee
- Place unopened condensed milk can in large pot
- Cover completely with boiling water
- Simmer for 2 hours (keep checking water level)
- Cool completely before opening

### 3. Assemble the Pie
- Spread toffee evenly over biscuit base
- Slice bananas and arrange on top
- Whip cream to soft peaks
- Spread cream over bananas
- Grate dark chocolate on top

### 4. Serve
- Chill for at least 2 hours
- Cut with sharp knife for clean slices
- Best served within 24 hours

## Pro Tips
- Use firm bananas to prevent browning
- Make toffee a day ahead for best results
- Add a pinch of sea salt to the toffee for extra flavor
- Dip banana slices in lemon juice to prevent oxidation

*Note: This is fallback content. Install OpenAI Agents SDK for real web browsing.*
"""
    elif "python" in task_lower:
        filename = "python_guide.md"
        content = """# Python Programming Guide

## What is Python?
Python is a high-level, interpreted programming language known for its simplicity and readability.

## Key Features
- **Easy to Learn**: Simple syntax similar to English
- **Versatile**: Web development, data science, AI, automation
- **Large Community**: Extensive libraries and support
- **Cross-platform**: Works on Windows, Mac, Linux

## Getting Started

### Installation
```bash
# Download from python.org
# Or use package managers:
brew install python3          # macOS
sudo apt install python3      # Ubuntu
```

### Your First Program
```python
print("Hello, World!")
```

### Basic Syntax
```python
# Variables
name = "Alice"
age = 25
is_student = True

# Lists
fruits = ["apple", "banana", "orange"]

# Functions
def greet(name):
    return f"Hello, {name}!"

# Loops
for fruit in fruits:
    print(fruit)
```

## Popular Libraries
- **Web**: Django, Flask, FastAPI
- **Data**: Pandas, NumPy, Matplotlib
- **AI/ML**: TensorFlow, PyTorch, scikit-learn
- **Automation**: Selenium, Requests, BeautifulSoup

*Note: This is fallback content. Install OpenAI Agents SDK for real research.*
"""
    else:
        filename = "task_output.md"
        content = f"""# Task Results

## Task Summary
**Original Task**: {task}

## Fallback Mode Notice
This content was generated in fallback mode because the full MCP agent setup is not available.

## What the Real MCP Agent Would Do
1. **Web Browsing**: Use Playwright to browse multiple websites
2. **AI Reasoning**: Apply GPT-4.1-mini for intelligent analysis
3. **Dynamic Content**: Generate fresh, accurate content based on current information
4. **File Operations**: Use filesystem MCP server for robust file handling

## To Enable Real MCP Agent
1. Install dependencies: `pip install openai-agents-sdk python-dotenv`
2. Set up OpenAI API key in .env file
3. Ensure Node.js is installed: `node --version`
4. Restart the server

## Current Results
This is simulated content based on keyword matching. The real agent would provide:
- Current, accurate information from web sources
- Intelligent synthesis of multiple sources
- Adaptive responses to any task type

**Generated**: {time.strftime('%Y-%m-%d %H:%M:%S')}
**Mode**: Fallback (Limited Functionality)
"""
    
    # Write the output file
    output_file = os.path.join(sandbox_path, filename)
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"📄 Created file: {filename}")
    except Exception as e:
        print(f"❌ Error creating file: {e}")
        raise
    
    print("✅ Fallback agent completed successfully!")
    return f"Fallback mode completed. Created {filename} with simulated content."

async def main(task):
    """Main function to run the appropriate agent"""
    
    # Setup environment
    setup_environment()
    
    # Check if we can run real MCP mode
    has_openai_key = bool(os.getenv('OPENAI_API_KEY'))
    
    if MCP_AVAILABLE and has_openai_key:
        print("🚀 Running REAL MCP AGENT with full web browsing capabilities")
        try:
            return await run_real_mcp_agent(task)
        except Exception as e:
            print(f"⚠️ Real MCP agent failed: {e}")
            print("🔄 Falling back to limited mode...")
            return run_fallback_agent(task)
    else:
        if not MCP_AVAILABLE:
            print("⚠️ OpenAI Agents SDK not installed")
            print("📦 Install with: pip install openai-agents-sdk python-dotenv")
        if not has_openai_key:
            print("⚠️ OpenAI API key not found in .env file")
            print("🔑 Add: OPENAI_API_KEY=your_key_here")
        print("🔄 Running in fallback mode...")
        return run_fallback_agent(task)

if __name__ == "__main__":
    print("🤖 MCP Agent Starting...")
    
    # Get task from command line arguments or stdin
    if len(sys.argv) > 1:
        task = " ".join(sys.argv[1:])
    else:
        # Read from stdin for web interface
        try:
            task = sys.stdin.read().strip()
        except Exception as e:
            print(f"❌ Error reading task: {e}")
            sys.exit(1)
    
    if not task:
        print("❌ No task provided")
        sys.exit(1)
    
    try:
        # Run the appropriate agent mode
        result = asyncio.run(main(task))
        
        print(f"\n🎉 FINAL RESULT:")
        print("-" * 50)
        print(result)
        print("-" * 50)
        sys.exit(0)
        
    except KeyboardInterrupt:
        print("\n🛑 Agent interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Agent execution error: {e}")
        print("\n🔧 Troubleshooting:")
        print("- Check OpenAI API key in .env file")
        print("- Ensure Node.js is installed (node --version)")
        print("- Install required packages: pip install openai-agents-sdk python-dotenv")
        sys.exit(1)